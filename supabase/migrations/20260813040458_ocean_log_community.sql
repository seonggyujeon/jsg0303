create table if not exists public.community_posts (
  id uuid primary key default gen_random_uuid(),
  caption text not null default '' check (char_length(caption) <= 2000),
  rating smallint not null default 0 check (rating between 0 and 5),
  created_at timestamptz not null default now()
);

create table if not exists public.community_media (
  id uuid primary key default gen_random_uuid(),
  post_id uuid not null references public.community_posts(id) on delete cascade,
  storage_path text not null unique check (char_length(storage_path) between 1 and 500),
  file_name text not null check (char_length(file_name) between 1 and 255),
  media_type text not null check (media_type in ('image', 'video')),
  position smallint not null default 0 check (position between 0 and 3),
  created_at timestamptz not null default now()
);

create table if not exists public.community_comments (
  id uuid primary key default gen_random_uuid(),
  post_id uuid not null references public.community_posts(id) on delete cascade,
  body text not null check (char_length(body) between 1 and 500),
  created_at timestamptz not null default now()
);

create index if not exists community_posts_created_at_idx on public.community_posts (created_at desc);
create index if not exists community_media_post_id_position_idx on public.community_media (post_id, position);
create index if not exists community_comments_post_id_created_at_idx on public.community_comments (post_id, created_at);

alter table public.community_posts enable row level security;
alter table public.community_media enable row level security;
alter table public.community_comments enable row level security;

grant usage on schema public to anon, authenticated;
grant select, insert on public.community_posts, public.community_media, public.community_comments to anon, authenticated;

create policy "community posts are public" on public.community_posts for select to anon, authenticated using (true);
create policy "any visitor can create a post" on public.community_posts for insert to anon, authenticated with check (true);
create policy "community media are public" on public.community_media for select to anon, authenticated using (true);
create policy "any visitor can attach media" on public.community_media for insert to anon, authenticated
with check (exists (select 1 from public.community_posts where community_posts.id = community_media.post_id));
create policy "community comments are public" on public.community_comments for select to anon, authenticated using (true);
create policy "any visitor can comment" on public.community_comments for insert to anon, authenticated
with check (exists (select 1 from public.community_posts where community_posts.id = community_comments.post_id));

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values ('community-media', 'community-media', true, 52428800, array[
  'image/jpeg', 'image/png', 'image/webp', 'image/gif', 'image/heic', 'image/heif',
  'video/mp4', 'video/webm', 'video/quicktime'
]);

create policy "visitors can upload community media" on storage.objects for insert to anon, authenticated
with check (
  bucket_id = 'community-media'
  and (storage.foldername(name))[1] ~* '^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$'
);
