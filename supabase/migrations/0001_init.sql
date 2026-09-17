-- 20대 취업/공모전/인턴 노하우 전자책 판매 + 고민 상담 커뮤니티
-- 초기 스키마: profiles, ebooks, purchases, posts, comments

-- ========== profiles ==========
create table if not exists public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  nickname text not null default '익명',
  is_admin boolean not null default false,
  created_at timestamptz not null default now()
);

alter table public.profiles enable row level security;

create policy "profiles are viewable by everyone"
  on public.profiles for select
  using (true);

create policy "users can update own profile"
  on public.profiles for update
  using (auth.uid() = id);

-- 회원가입 시 프로필 자동 생성
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  insert into public.profiles (id, nickname)
  values (new.id, coalesce(new.raw_user_meta_data ->> 'nickname', split_part(new.email, '@', 1)));
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- ========== ebooks ==========
create table if not exists public.ebooks (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  title text not null,
  description text not null default '',
  price integer not null check (price >= 0),
  cover_url text,
  file_path text not null, -- storage 'ebooks' 버킷 내 경로 (비공개)
  is_published boolean not null default true,
  created_at timestamptz not null default now()
);

alter table public.ebooks enable row level security;

create policy "published ebooks are viewable by everyone"
  on public.ebooks for select
  using (is_published = true);

-- ========== purchases ==========
create type public.purchase_status as enum ('pending', 'paid', 'failed', 'canceled');

create table if not exists public.purchases (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles (id) on delete cascade,
  ebook_id uuid not null references public.ebooks (id) on delete cascade,
  amount integer not null,
  status public.purchase_status not null default 'pending',
  kakao_tid text,
  kakao_partner_order_id text not null,
  created_at timestamptz not null default now(),
  paid_at timestamptz
);

alter table public.purchases enable row level security;

create policy "users can view own purchases"
  on public.purchases for select
  using (auth.uid() = user_id);

-- insert/update는 서비스 롤(서버)에서만 수행하므로 별도 정책 없음

-- ========== posts (고민글) ==========
create table if not exists public.posts (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles (id) on delete cascade,
  title text not null,
  content text not null,
  is_answered boolean not null default false,
  created_at timestamptz not null default now()
);

alter table public.posts enable row level security;

create policy "posts are viewable by everyone"
  on public.posts for select
  using (true);

create policy "authenticated users can create posts"
  on public.posts for insert
  with check (auth.uid() = user_id);

create policy "owners can update own posts"
  on public.posts for update
  using (auth.uid() = user_id);

create policy "owners can delete own posts"
  on public.posts for delete
  using (auth.uid() = user_id);

-- ========== comments (답변) ==========
create table if not exists public.comments (
  id uuid primary key default gen_random_uuid(),
  post_id uuid not null references public.posts (id) on delete cascade,
  user_id uuid not null references public.profiles (id) on delete cascade,
  content text not null,
  is_admin_answer boolean not null default false,
  created_at timestamptz not null default now()
);

alter table public.comments enable row level security;

create policy "comments are viewable by everyone"
  on public.comments for select
  using (true);

create policy "authenticated users can create comments"
  on public.comments for insert
  with check (auth.uid() = user_id);

create policy "owners can delete own comments"
  on public.comments for delete
  using (auth.uid() = user_id);

-- 운영자가 댓글을 달면 자동으로 is_admin_answer = true, 게시글은 답변완료 처리
create or replace function public.handle_new_comment()
returns trigger
language plpgsql
security definer set search_path = public
as $$
declare
  commenter_is_admin boolean;
begin
  select is_admin into commenter_is_admin from public.profiles where id = new.user_id;

  if commenter_is_admin then
    new.is_admin_answer := true;
  end if;

  return new;
end;
$$;

drop trigger if exists on_comment_insert on public.comments;
create trigger on_comment_insert
  before insert on public.comments
  for each row execute procedure public.handle_new_comment();

create or replace function public.handle_comment_after_insert()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  if new.is_admin_answer then
    update public.posts set is_answered = true where id = new.post_id;
  end if;
  return new;
end;
$$;

drop trigger if exists on_comment_after_insert on public.comments;
create trigger on_comment_after_insert
  after insert on public.comments
  for each row execute procedure public.handle_comment_after_insert();

-- ========== storage ==========
insert into storage.buckets (id, name, public)
values ('covers', 'covers', true)
on conflict (id) do nothing;

insert into storage.buckets (id, name, public)
values ('ebooks', 'ebooks', false)
on conflict (id) do nothing;

create policy "cover images are publicly readable"
  on storage.objects for select
  using (bucket_id = 'covers');

-- ebooks 버킷은 공개 정책 없음: 서버(service role)에서만 signed URL 발급
