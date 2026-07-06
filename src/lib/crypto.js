// 端到端加密（API 配置跨设备同步用）
//
// 信任模型：用户自设"同步密码"，密码只存在用户脑子里，永不上传。
// 浏览器本地用 PBKDF2 从密码派生 AES-256-GCM 密钥，加密后的密文才进云端。
// 服务器（和站长）只能看到密文——没有密码，谁都解不开。
// 忘记密码没有后门：重新填一遍 API key 再同步即可。

const PBKDF2_ITERATIONS = 200000;

function toB64(buf) {
  return btoa(String.fromCharCode(...new Uint8Array(buf)));
}

function fromB64(str) {
  return Uint8Array.from(atob(str), (c) => c.charCodeAt(0));
}

async function deriveKey(passphrase, salt) {
  const material = await crypto.subtle.importKey(
    "raw",
    new TextEncoder().encode(passphrase),
    "PBKDF2",
    false,
    ["deriveKey"],
  );
  return crypto.subtle.deriveKey(
    { name: "PBKDF2", salt, iterations: PBKDF2_ITERATIONS, hash: "SHA-256" },
    material,
    { name: "AES-GCM", length: 256 },
    false,
    ["encrypt", "decrypt"],
  );
}

/** 加密任意字符串 → 自包含密文（含 salt/iv，base64 JSON） */
export async function encryptWithPassphrase(plaintext, passphrase) {
  const salt = crypto.getRandomValues(new Uint8Array(16));
  const iv = crypto.getRandomValues(new Uint8Array(12));
  const key = await deriveKey(passphrase, salt);
  const ct = await crypto.subtle.encrypt(
    { name: "AES-GCM", iv },
    key,
    new TextEncoder().encode(plaintext),
  );
  return JSON.stringify({ v: 1, salt: toB64(salt), iv: toB64(iv), ct: toB64(ct) });
}

/** 解密。密码错误 / 密文损坏时抛错。 */
export async function decryptWithPassphrase(payload, passphrase) {
  const { salt, iv, ct } = JSON.parse(payload);
  const key = await deriveKey(passphrase, fromB64(salt));
  const pt = await crypto.subtle.decrypt(
    { name: "AES-GCM", iv: fromB64(iv) },
    key,
    fromB64(ct),
  );
  return new TextDecoder().decode(pt);
}
