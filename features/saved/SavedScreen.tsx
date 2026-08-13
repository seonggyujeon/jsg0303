"use client";

/* eslint-disable jsx-a11y/media-has-caption, @next/next/no-img-element -- User-selected local media uses object URLs and does not include separate caption tracks. */

import { useEffect, useMemo, useState, type ChangeEvent, type FormEvent } from "react";
import { useAdminMode } from "@/lib/admin/AdminModeProvider";
import { useAppFlow } from "@/lib/app-flow/AppFlowProvider";
import { deleteCommunityMedia, readCommunityMedia, readCommunityPosts, saveCommunityMedia, writeCommunityPosts, type CommunityMedia, type CommunityPost } from "@/lib/community/storage";
import type { AppLocale, LocalizedText } from "@/types/i18n";

const COPY = {
  kicker: { ko: "OCEAN LOG COMMUNITY", zh: "OCEAN LOG 社区", ja: "OCEAN LOG コミュニティ", en: "OCEAN LOG COMMUNITY" },
  title: { ko: "바다 경험을 나눠요", zh: "分享你的海边体验", ja: "海の体験をシェア", en: "Share your coast story" },
  description: { ko: "다녀온 장소의 사진과 영상, 솔직한 후기를 다른 여행자와 나눠보세요.", zh: "与其他旅行者分享照片、视频和真实体验。", ja: "訪れた場所の写真や動画、感想を旅仲間と共有しましょう。", en: "Share photos, videos and honest notes from the places you visited." },
  create: { ko: "후기 올리기", zh: "发布体验", ja: "体験を投稿", en: "Create a post" },
  createHint: { ko: "+ 버튼을 눌러 사진이나 동영상을 추가하세요.", zh: "点击 + 添加照片或视频。", ja: "+ ボタンで写真や動画を追加できます。", en: "Tap + to add photos or videos." },
  addMedia: { ko: "사진·동영상 추가", zh: "添加照片或视频", ja: "写真・動画を追加", en: "Add photos or videos" },
  caption: { ko: "어떤 경험이었나요? 장소의 분위기나 팁을 남겨주세요.", zh: "体验如何？请分享氛围或旅行小贴士。", ja: "どんな体験でしたか？雰囲気や旅のヒントを教えてください。", en: "How was it? Share the atmosphere or a useful tip." },
  rating: { ko: "이 장소의 평점", zh: "地点评分", ja: "スポットの評価", en: "Rate this place" },
  publish: { ko: "후기 게시하기", zh: "发布体验", ja: "投稿する", en: "Publish post" },
  posting: { ko: "게시 중…", zh: "发布中…", ja: "投稿中…", en: "Publishing…" },
  feed: { ko: "여행자 후기", zh: "旅行者体验", ja: "旅人の投稿", en: "Traveler stories" },
  feedHint: { ko: "게시물 아래 말풍선에서 코멘트를 나눌 수 있어요.", zh: "可在每篇帖子下方留言交流。", ja: "投稿の下からコメントできます。", en: "Join the conversation below each post." },
  empty: { ko: "아직 올라온 후기가 없어요. 첫 바다 이야기를 남겨보세요.", zh: "还没有体验分享，发布第一篇吧。", ja: "まだ投稿がありません。最初の海の思い出を残しましょう。", en: "No stories yet. Share the first coast memory." },
  comment: { ko: "코멘트를 남겨주세요", zh: "写下评论", ja: "コメントを書く", en: "Write a comment" },
  send: { ko: "등록", zh: "发送", ja: "送信", en: "Post" },
  mediaRequired: { ko: "사진이나 동영상을 하나 이상 추가해 주세요.", zh: "请至少添加一张照片或一个视频。", ja: "写真または動画を1つ以上追加してください。", en: "Add at least one photo or video." },
  sizeError: { ko: "파일 하나당 50MB 이하로 올려주세요.", zh: "每个文件需小于50MB。", ja: "1ファイル50MB以下で追加してください。", en: "Keep each file under 50MB." },
  adminActive: { ko: "관리자 모드", zh: "管理员模式", ja: "管理者モード", en: "Admin mode" },
  deletePost: { ko: "게시물 삭제", zh: "删除帖子", ja: "投稿を削除", en: "Delete post" },
  deleteConfirm: { ko: "이 게시물과 첨부된 사진·동영상을 삭제할까요?", zh: "要删除此帖子及其照片和视频吗？", ja: "この投稿と添付された写真・動画を削除しますか？", en: "Delete this post and its attached photos and videos?" },
} satisfies Record<string, LocalizedText>;

const localeTag: Record<AppLocale, string> = { ko: "ko-KR", zh: "zh-CN", ja: "ja-JP", en: "en-US" };

function MediaGallery({ media }: { media: CommunityMedia[] }) {
  const [sources, setSources] = useState<Record<string, string>>({});
  useEffect(() => {
    let active = true;
    const objectUrls: string[] = [];
    Promise.all(media.map(async (item) => {
      const blob = await readCommunityMedia(item.id);
      if (!blob) return null;
      const url = URL.createObjectURL(blob);
      objectUrls.push(url);
      return [item.id, url] as const;
    })).then((entries) => {
      if (active) setSources(Object.fromEntries(entries.filter((entry): entry is readonly [string, string] => entry !== null)));
    });
    return () => {
      active = false;
      objectUrls.forEach((url) => URL.revokeObjectURL(url));
    };
  }, [media]);
  return <div className={`ol-community-media ol-community-media--${Math.min(media.length, 4)}`}>
    {media.map((item) => item.type === "video"
      ? <video controls key={item.id} playsInline src={sources[item.id]} />
      : <img alt={item.name} key={item.id} loading="lazy" src={sources[item.id]} />)}
  </div>;
}

export function SavedScreen() {
  const { locale } = useAppFlow();
  const { isAdmin } = useAdminMode();
  const activeLocale = locale ?? "en";
  const t = (key: keyof typeof COPY) => COPY[key][activeLocale];
  const [posts, setPosts] = useState<CommunityPost[]>([]);
  const [files, setFiles] = useState<File[]>([]);
  const [caption, setCaption] = useState("");
  const [rating, setRating] = useState(0);
  const [commentDrafts, setCommentDrafts] = useState<Record<string, string>>({});
  const [error, setError] = useState("");
  const [publishing, setPublishing] = useState(false);

  useEffect(() => {
    const hydrationTask = window.setTimeout(() => setPosts(readCommunityPosts()), 0);
    return () => window.clearTimeout(hydrationTask);
  }, []);
  const previews = useMemo(() => files.map((file) => ({ file, url: URL.createObjectURL(file) })), [files]);
  useEffect(() => () => previews.forEach(({ url }) => URL.revokeObjectURL(url)), [previews]);

  const chooseMedia = (event: ChangeEvent<HTMLInputElement>) => {
    const selected = Array.from(event.target.files ?? []).slice(0, 4);
    if (selected.some((file) => file.size > 50 * 1024 * 1024)) {
      setError(t("sizeError"));
      event.target.value = "";
      return;
    }
    setFiles(selected);
    setError("");
  };

  const publish = async (event: FormEvent) => {
    event.preventDefault();
    if (files.length === 0) {
      setError(t("mediaRequired"));
      return;
    }
    setPublishing(true);
    const id = crypto.randomUUID();
    try {
      const media = await saveCommunityMedia(id, files);
      const post: CommunityPost = { id, caption: caption.trim(), rating, createdAt: new Date().toISOString(), media, comments: [] };
      const next = [post, ...posts];
      setPosts(next);
      writeCommunityPosts(next);
      setFiles([]);
      setCaption("");
      setRating(0);
      setError("");
    } finally {
      setPublishing(false);
    }
  };

  const addComment = (postId: string) => {
    const text = commentDrafts[postId]?.trim();
    if (!text) return;
    const next = posts.map((post) => post.id === postId ? {
      ...post,
      comments: [...post.comments, { id: crypto.randomUUID(), text, createdAt: new Date().toISOString() }],
    } : post);
    setPosts(next);
    writeCommunityPosts(next);
    setCommentDrafts((current) => ({ ...current, [postId]: "" }));
  };

  const removePost = async (post: CommunityPost) => {
    if (!isAdmin || !window.confirm(t("deleteConfirm"))) return;
    await deleteCommunityMedia(post.media);
    const next = posts.filter((item) => item.id !== post.id);
    setPosts(next);
    writeCommunityPosts(next);
  };

  return <main className="ol-community-screen">
    <header className="ol-community-intro">
      <div className="ol-community-intro__copy"><p>{t("kicker")}</p><h1>{t("title")}</h1><span>{t("description")}</span><div className="ol-community-tags" aria-hidden="true"><i>PHOTO</i><i>VIDEO</i><i>REVIEW</i></div></div>
      <div className="ol-community-collage" aria-hidden="true"><img alt="" src="/place-photos/gwangalli.jpg" /><img alt="" src="/place-photos/oryukdo.jpg" /><img alt="" src="/place-photos/dadaepo.jpg" /><span>OCEAN<br />MEMORY</span></div>
    </header>
    <div className="ol-community-columns">
      <section className="ol-community-panel ol-community-composer">
        <div className="ol-community-panel__heading"><span>01</span><div><h2>{t("create")}</h2><p>{t("createHint")}</p></div></div>
        <form onSubmit={publish}>
          <label className="ol-media-picker"><input accept="image/*,video/*" multiple onChange={chooseMedia} type="file" /><strong aria-hidden="true">＋</strong><span>{t("addMedia")}</span></label>
          {previews.length > 0 && <div className="ol-media-preview">{previews.map(({ file, url }) => file.type.startsWith("video/") ? <video key={url} muted playsInline src={url} /> : <img alt="" key={url} src={url} />)}</div>}
          <textarea aria-label={t("caption")} onChange={(event) => setCaption(event.target.value)} placeholder={t("caption")} rows={5} value={caption} />
          <fieldset className="ol-rating"><legend>{t("rating")}</legend><div>{[1, 2, 3, 4, 5].map((value) => <button aria-label={`${value} / 5`} aria-pressed={rating === value} key={value} onClick={() => setRating(value)} type="button">{value <= rating ? "★" : "☆"}</button>)}</div></fieldset>
          {error && <p className="ol-community-error" role="alert">{error}</p>}
          <button className="ol-community-publish" disabled={publishing} type="submit">{publishing ? t("posting") : t("publish")} <span aria-hidden="true">→</span></button>
        </form>
      </section>
      <section className="ol-community-panel ol-community-feed">
        <div className="ol-community-panel__heading"><span>02</span><div><h2>{t("feed")}</h2><p>{t("feedHint")}</p></div>{isAdmin && <strong className="ol-admin-badge">{t("adminActive")}</strong>}</div>
        {posts.length === 0 ? <div className="ol-community-empty"><div className="ol-community-empty__post" aria-hidden="true"><span>OCEAN LOG</span><div /><i /><i /></div><p>{t("empty")}</p></div> : <div className="ol-community-posts">
          {posts.map((post) => <article className="ol-community-post" key={post.id}>
            <MediaGallery media={post.media} />
            <div className="ol-community-post__body">
              <div className="ol-community-post__meta"><span>{"★".repeat(post.rating)}{"☆".repeat(5 - post.rating)}</span><div><time>{new Intl.DateTimeFormat(localeTag[activeLocale], { dateStyle: "medium" }).format(new Date(post.createdAt))}</time>{isAdmin && <button onClick={() => removePost(post)} type="button">{t("deletePost")}</button>}</div></div>
              {post.caption && <p>{post.caption}</p>}
              <div className="ol-comments">
                {post.comments.map((comment) => <p key={comment.id}><span aria-hidden="true">◜</span>{comment.text}</p>)}
                <div><input aria-label={t("comment")} onChange={(event) => setCommentDrafts((current) => ({ ...current, [post.id]: event.target.value }))} onKeyDown={(event) => { if (event.key === "Enter") addComment(post.id); }} placeholder={t("comment")} value={commentDrafts[post.id] ?? ""} /><button onClick={() => addComment(post.id)} type="button">{t("send")}</button></div>
              </div>
            </div>
          </article>)}
        </div>}
      </section>
    </div>
  </main>;
}
