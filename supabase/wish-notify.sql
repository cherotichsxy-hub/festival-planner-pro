-- ============================================================
-- 可选：有人许愿时给站长发邮件提醒
-- 前置：把下面的 BREVO_API_KEY_HERE 换成你的 Brevo API key
--   （Brevo 控制台 → SMTP & API → API Keys 标签 → Generate a new API key，
--     以 xkeysib- 开头。注意是 API key，不是 SMTP key）
-- 用法：替换 key 后整个文件粘到 Supabase SQL Editor 运行
-- 效果：wishes 表每进一条 → Brevo 发一封 [FP-WISH] 邮件到你的 Gmail
-- ============================================================

create extension if not exists pg_net;

create or replace function public.notify_wish()
returns trigger
language plpgsql
security definer
as $$
begin
  perform net.http_post(
    url := 'https://api.brevo.com/v3/smtp/email',
    headers := jsonb_build_object(
      'Content-Type', 'application/json',
      'api-key', 'BREVO_API_KEY_HERE'
    ),
    body := jsonb_build_object(
      'sender', jsonb_build_object('email', 'axisxyxy@gmail.com', 'name', 'Festival Planner'),
      'to', jsonb_build_array(jsonb_build_object('email', 'axisxyxy@gmail.com')),
      'subject', '[FP-WISH] 新许愿：' || new.festival_name,
      'htmlContent',
        '<h3>有人许愿了</h3>'
        || '<p>音乐节：<strong>' || new.festival_name || '</strong></p>'
        || '<p>年份：' || coalesce(new.year, '未填') || '</p>'
        || '<p>链接：' || coalesce(new.link, '未填') || '</p>'
        || '<p style="color:#888">全部愿望在 Supabase 控制台 Table Editor → wishes 表里</p>'
    )
  );
  return new;
end;
$$;

drop trigger if exists wish_notify on public.wishes;
create trigger wish_notify
  after insert on public.wishes
  for each row execute function public.notify_wish();
