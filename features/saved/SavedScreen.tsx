"use client";

/* eslint-disable jsx-a11y/media-has-caption, @next/next/no-img-element -- Community media can be user-provided videos and remote images. */

import { useEffect, useMemo, useState, type ChangeEvent, type FormEvent } from "react";
import { useAdminMode } from "@/lib/admin/AdminModeProvider";
import { useAppFlow } from "@/lib/app-flow/AppFlowProvider";
import { createCommunityComment, createCommunityPost, deleteCommunityPost, readCommunityPosts, type CommunityMedia, type CommunityPost } from "@/lib/community/storage";
import type { AppLocale, LocalizedText } from "@/types/i18n";

const COPY = {
  kicker: { ko: "OCEAN LOG COMMUNITY", zh: "OCEAN LOG 社区", ja: "OCEAN LOG コミュニティ", en: "OCEAN LOG COMMUNITY" },
  title: { ko: "바다 경험을 나눠요", zh: "分享你的海边体验", ja: "海の体験をシェア", en: "Share your coast story" },
  description: { ko: "다녀온 장소의 사진과 영상, 솔직한 후기를 다른 여행자와 나눠보세요.", zh: "与其他旅行者分享照片、视频和真实体验。", ja: "訪れた場所の写真や動画、感想を旅仲間と共有しましょう。", en: "Share photos, videos and honest notes from the places you visited." },
  shared: { ko: "이제 모든 기기에서 같은 후기를 볼 수 있어요.", zh: "现在所有设备都能看到相同的体验分享。", ja: "すべての端末で同じ投稿を見ることができます。", en: "Stories are now shared across every device." },
  create: { ko: "후기 올리기", zh: "发布体验", ja: "体験を投稿", en: "Create a post" },
  createHint: { ko: "+ 버튼을 눌러 사진이나 동영상을 추가하세요.", zh: "点击 + 添加照片或视频。", ja: "+ ボタンで写真や動画を追加できます。", en: "Tap + to add photos or videos." },
  addMedia: { ko: "사진·동영상 추가", zh: "添加照片或视频", ja: "写真・動画を追加", en: "Add photos or videos" },
  caption: { ko: "어떤 경험이었나요? 장소의 분위기나 팁을 남겨주세요.", zh: "体验如何？请分享氛围或旅行小贴士。", ja: "どんな体験でしたか？雰囲気や旅のヒントを教えてください。", en: "How was it? Share the atmosphere or a useful tip." },
  rating: { ko: "이 장소의 평점", zh: "地点评分", ja: "スポットの評価", en: "Rate this place" },
  publish: { ko: "후기 게시하기", zh: "发布体验", ja: "投稿する", en: "Publish post" },
  posting: { ko: "게시 중…", zh: "发布中…", ja: "投稿中…", en: "Publishing…" },
  feed: { ko: "여행자 후기", zh: "旅行者体验", ja: "旅人の投稿", en: "Traveler stories" },
  feedHint: { ko: "게시물 아래 말풍선에서 코멘트를 나눌 수 있어요.", zh: "可在每篇帖子下方留言交流。", ja: "投稿の下からコメントできます。", en: "Join the conversation below each post." },
  loading: { ko: "여행자 후기를 불러오는 중이에요…", zh: "正在加载旅行者体验…", ja: "旅人の投稿を読み込んでいます…", en: "Loading traveler stories…" },
  empty: { ko: "아직 올라온 후기가 없어요. 첫 바다 이야기를 남겨보세요.", zh: "还没有体验分享，发布第一篇吧。", ja: "まだ投稿がありません。最初の海の思い出を残しましょう。", en: "No stories yet. Share the first coast memory." },
  comment: { ko: "코멘트를 남겨주세요", zh: "写下评论", ja: "コメントを書く", en: "Write a comment" },
  send: { ko: "등록", zh: "发送", ja: "送信", en: "Post" },
  mediaRequired: { ko: "사진이나 동영상을 하나 이상 추가해 주세요.", zh: "请至少添加一张照片或一个视频。", ja: "写真または動画を1つ以上追加してください。", en: "Add at least one photo or video." },
  sizeError: { ko: "파일 하나당 50MB 이하로 올려주세요.", zh: "每个文件需小于 50MB。", ja: "1ファイル50MB以下で追加してください。", en: "Keep each file under 50MB." },
  loadError: { ko: "후기를 불러오지 못했어요. 잠시 후 다시 시도해 주세요.", zh: "无法加载体验，请稍后重试。", ja: "投稿を読み込めませんでした。しばらくしてからお試しください。", en: "Stories could not be loaded. Please try again shortly." },
  publishError: { ko: "후기를 게시하지 못했어요. 연결 상태를 확인해 주세요.", zh: "发布失败，请检查网络连接。", ja: "投稿できませんでした。接続をご確認ください。", en: "The post could not be published. Check your connection." },
  commentError: { ko: "코멘트를 등록하지 못했어요.", zh: "评论发送失败。", ja: "コメントを送信できませんでした。", en: "The comment could not be posted." },
  deleteError: { ko: "게시물을 삭제하지 못했어요. 관리자 모드를 다시 활성화해 주세요.", zh: "无法删除帖子，请重新启用管理员模式。", ja: "投稿を削除できませんでした。管理者モードを再度有効にしてください。", en: "The post could not be deleted. Reactivate admin mode." },
  adminActive: { ko: "관리자 모드", zh: "管理员模式", ja: "管理者モード", en: "Admin mode" },
  deletePost: { ko: "게시물 삭제", zh: "删除帖子", ja: "投稿を削除", en: "Delete post" },
  deleteConfirm: { ko: "이 게시물과 첨부된 사진·동영상을 삭제할까요?", zh: "要删除此帖子及其照片和视频吗？", ja: "この投稿と添付された写真・動画を削除しますか？", en: "Delete this post and its attached photos and videos?" },
} satisfies Record<string, LocalizedText>;

const localeTag: Record<AppLocale, string> = { ko: "ko-KR", zh: "zh-CN", ja: "ja-JP", en: "en-US" };

function MediaGallery({ media }: { media: CommunityMedia[] }) {
  return <div className={`ol-community-media ol-community-media--${Math.min(media.length, 4)}`}>
    {media.map((item) => item.type === "video"
      ? <video controls key={item.id} playsInline src={item.url} />
      : <img alt={item.name} key={item.id} loading="lazy" src={item.url} />)}
  </div>;
}

export function SavedScreen() {
  const { locale } = useAppFlow();
  const { adminToken, isAdmin } = useAdminMode();
  const activeLocale = locale ?? "en";
  const t = (key: keyof typeof COPY) => COPY[key][activeLocale];
  const [posts, setPosts] = useState<CommunityPost[]>([]);
  const [files, setFiles] = useState<File[]>([]);
  const [caption, setCaption] = useState("");
  const [rating, setRating] = useState(0);
  const [commentDrafts, setCommentDrafts] = useState<Record<string, string>>({});
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [publishing, setPublishing] = useState(false);

  useEffect(() => {
    let active = true;
    readCommunityPosts()
      .then((nextPosts) => { if (active) setPosts(nextPosts); })
      .catch(() => { if (active) setError(t("loadError")); })
      .finally(() => { if (active) setLoading(false); });
    return () => { active = false; };
  // The feed is loaded once on entry; locale changes are handled by the surrounding flow.
  // eslint-disable-next-line react-hooks/exhaustive-deps
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
    setError("");
    try {
      const post = await createCommunityPost(caption.trim(), rating, files);
      setPosts((current) => [post, ...current]);
      setFiles([]);
      setCaption("");
      setRating(0);
    } catch {
      setError(t("publishError"));
    } finally {
      setPublishing(false);
    }
  };

  const addComment = async (postId: string) => {
    const text = commentDrafts[postId]?.trim();
    if (!text) return;
    setError("");
    try {
      const comment = await createCommunityComment(postId, text);
      setPosts((current) => current.map((post) => post.id === postId
        ? { ...post, comments: [...post.comments, comment] }
        : post));
      setCommentDrafts((current) => ({ ...current, [postId]: "" }));
    } catch {
      setError(t("commentError"));
    }
  };

  const removePost = async (post: CommunityPost) => {
    if (!adminToken || !window.confirm(t("deleteConfirm"))) return;
    setError("");
    try {
      await deleteCommunityPost(post.id, adminToken);
      setPosts((current) => current.filter((item) => item.id !== post.id));
    } catch {
      setError(t("deleteError"));
    }
  };

  return <main className="ol-community-screen">
    <header className="ol-community-intro">
      <div className="ol-community-intro__copy"><p>{t("kicker")}</p><h1>{t("title")}</h1><span>{t("description")}</span><div className="ol-community-tags" aria-hidden="true"><i>PHOTO</i><i>VIDEO</i><i>REVIEW</i></div></div>
      <div className="ol-community-collage" aria-hidden="true"><img alt="" src="/place-photos/gwangalli.jpg" /><img alt="" src="/place-photos/oryukdo.jpg" /><img alt="" src="/place-photos/dadaepo.jpg" /><span>OCEAN<br />MEMORY</span></div>
    </header>
    <p className="ol-community-shared">☁ {t("shared")}</p>
    <div className="ol-community-columns">
      <section className="ol-community-panel ol-community-composer">
        <div className="ol-community-panel__heading"><span>01</span><div><h2>{t("create")}</h2><p>{t("createHint")}</p></div></div>
        <form onSubmit={publish}>
          <label className="ol-media-picker"><input accept="image/jpeg,image/png,image/webp,image/gif,image/heic,image/heif,video/mp4,video/webm,video/quicktime" multiple onChange={chooseMedia} type="file" /><strong aria-hidden="true">＋</strong><span>{t("addMedia")}</span></label>
          {previews.length > 0 && <div className="ol-media-preview">{previews.map(({ file, url }) => file.type.startsWith("video/") ? <video key={url} muted playsInline src={url} /> : <img alt="" key={url} src={url} />)}</div>}
          <textarea aria-label={t("caption")} maxLength={2000} onChange={(event) => setCaption(event.target.value)} placeholder={t("caption")} rows={5} value={caption} />
          <fieldset className="ol-rating"><legend>{t("rating")}</legend><div>{[1, 2, 3, 4, 5].map((value) => <button aria-label={`${value} / 5`} aria-pressed={rating === value} key={value} onClick={() => setRating(value)} type="button">{value <= rating ? "★" : "☆"}</button>)}</div></fieldset>
          {error && <p className="ol-community-error" role="alert">{error}</p>}
          <button className="ol-community-publish" disabled={publishing} type="submit">{publishing ? t("posting") : t("publish")} <span aria-hidden="true">→</span></button>
        </form>
      </section>
      <section className="ol-community-panel ol-community-feed">
        <div className="ol-community-panel__heading"><span>02</span><div><h2>{t("feed")}</h2><p>{t("feedHint")}</p></div>{isAdmin && <strong className="ol-admin-badge">{t("adminActive")}</strong>}</div>
        {loading ? <div className="ol-community-empty"><p>{t("loading")}</p></div> : posts.length === 0 ? <div className="ol-community-empty"><div className="ol-community-empty__post" aria-hidden="true"><span>OCEAN LOG</span><div /><i /><i /></div><p>{t("empty")}</p></div> : <div className="ol-community-posts">
          {posts.map((post) => <article className="ol-community-post" key={post.id}>
            <MediaGallery media={post.media} />
            <div className="ol-community-post__body">
              <div className="ol-community-post__meta"><span>{"★".repeat(post.rating)}{"☆".repeat(5 - post.rating)}</span><div><time>{new Intl.DateTimeFormat(localeTag[activeLocale], { dateStyle: "medium" }).format(new Date(post.createdAt))}</time>{isAdmin && <button onClick={() => removePost(post)} type="button">{t("deletePost")}</button>}</div></div>
              {post.caption && <p>{post.caption}</p>}
              <div className="ol-comments">
                {post.comments.map((comment) => <p key={comment.id}><span aria-hidden="true">◜</span>{comment.text}</p>)}
                <div><input aria-label={t("comment")} maxLength={500} onChange={(event) => setCommentDrafts((current) => ({ ...current, [post.id]: event.target.value }))} onKeyDown={(event) => { if (event.key === "Enter") void addComment(post.id); }} placeholder={t("comment")} value={commentDrafts[post.id] ?? ""} /><button onClick={() => void addComment(post.id)} type="button">{t("send")}</button></div>
              </div>
            </div>
          </article>)}
        </div>}
      </section>
    </div>
  </main>;
}
