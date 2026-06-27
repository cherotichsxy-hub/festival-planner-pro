import React from "react";

export default function UploadScreen({ onBack }) {
  return (
    <>
      <header className="upload-header">
        <button className="back-btn" onClick={onBack} aria-label="返回">‹</button>
        <h1 className="upload-title">UPLOAD POSTER.</h1>
        <p className="upload-sub u-mono">
          拍一张海报或选张截图 · AI 自动识别成时间表
        </p>
      </header>

      <main className="upload-body">
        <div className="upload-placeholder">
          <p className="u-mono">— 上传 + AI 解析功能即将上线 —</p>
          <p>下一个 commit 会带来 DeepSeek vision + Tesseract 兜底</p>
        </div>
      </main>
    </>
  );
}
