-- ============================================================
-- Festival Planner Pro · Supabase 建库脚本
-- 用法：Supabase 控制台 → SQL Editor → 粘贴整个文件 → Run
-- 安全模型：anon key 可公开，真正的权限控制全靠下面的 RLS 策略
-- ============================================================

-- 共享音乐节：所有人可读，登录用户可发布；同 id 重复发布 = 覆盖（upsert）
create table if not exists public.community_festivals (
  id text primary key,
  festival jsonb not null,
  performances jsonb not null default '[]',
  created_by uuid default auth.uid(),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.community_festivals enable row level security;

drop policy if exists "community read" on public.community_festivals;
create policy "community read"
  on public.community_festivals for select
  using (true);

drop policy if exists "community insert" on public.community_festivals;
create policy "community insert"
  on public.community_festivals for insert
  to authenticated
  with check (true);

-- 覆盖更新：只允许原发布者更新自己发的那条
drop policy if exists "community update own" on public.community_festivals;
create policy "community update own"
  on public.community_festivals for update
  to authenticated
  using (created_by = auth.uid())
  with check (created_by = auth.uid());

-- 个人数据：一行一个 key（selections / wanted / attended / headliners / axisChoice / vision_api_enc）
-- RLS 保证只有本人能读写自己的行——站长也无法通过 anon/authenticated 角色读别人的数据
create table if not exists public.user_data (
  user_id uuid not null default auth.uid() references auth.users (id) on delete cascade,
  key text not null,
  value jsonb,
  updated_at timestamptz not null default now(),
  primary key (user_id, key)
);

alter table public.user_data enable row level security;

drop policy if exists "own data all" on public.user_data;
create policy "own data all"
  on public.user_data for all
  to authenticated
  using (user_id = auth.uid())
  with check (user_id = auth.uid());

-- 许愿：任何人（含未登录）可提交；没有 select 策略 = 谁都读不到，
-- 只有站长在 Supabase 控制台（Table Editor）里能看
create table if not exists public.wishes (
  id bigint generated always as identity primary key,
  festival_name text not null,
  year text,
  link text,
  created_at timestamptz not null default now()
);

alter table public.wishes enable row level security;

drop policy if exists "wish insert" on public.wishes;
create policy "wish insert"
  on public.wishes for insert
  to anon, authenticated
  with check (char_length(festival_name) between 1 and 200);
