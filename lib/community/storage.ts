import { supabase } from "@/lib/supabase/client";

export interface CommunityMedia {
  id: string;
  name: string;
  type: "image" | "video";
  url: string;
}

export interface CommunityComment {
  id: string;
  text: string;
  createdAt: string;
}

export interface CommunityPost {
  id: string;
  caption: string;
  rating: number;
  createdAt: string;
  media: CommunityMedia[];
  comments: CommunityComment[];
}

interface CommunityPostRow {
  id: string;
  caption: string;
  rating: number;
  created_at: string;
  community_media: Array<{
    id: string;
    file_name: string;
    media_type: "image" | "video";
    position: number;
    storage_path: string;
  }>;
  community_comments: Array<{
    id: string;
    body: string;
    created_at: string;
  }>;
}

const MEDIA_BUCKET = "community-media";

function publicMediaUrl(path: string): string {
  return supabase.storage.from(MEDIA_BUCKET).getPublicUrl(path).data.publicUrl;
}

function toCommunityPost(row: CommunityPostRow): CommunityPost {
  return {
    id: row.id,
    caption: row.caption,
    rating: row.rating,
    createdAt: row.created_at,
    media: [...row.community_media]
      .sort((left, right) => left.position - right.position)
      .map((item) => ({
        id: item.id,
        name: item.file_name,
        type: item.media_type,
        url: publicMediaUrl(item.storage_path),
      })),
    comments: [...row.community_comments]
      .sort((left, right) => left.created_at.localeCompare(right.created_at))
      .map((comment) => ({ id: comment.id, text: comment.body, createdAt: comment.created_at })),
  };
}

export async function readCommunityPosts(): Promise<CommunityPost[]> {
  const { data, error } = await supabase
    .from("community_posts")
    .select("id, caption, rating, created_at, community_media(id, file_name, media_type, position, storage_path), community_comments(id, body, created_at)")
    .order("created_at", { ascending: false });
  if (error) throw error;
  return (data as CommunityPostRow[]).map(toCommunityPost).filter((post) => post.media.length > 0);
}

function safeExtension(file: File): string {
  const extension = file.name.split(".").pop()?.toLowerCase().replace(/[^a-z0-9]/g, "");
  if (extension && extension.length <= 8) return extension;
  if (file.type === "image/jpeg") return "jpg";
  if (file.type === "image/png") return "png";
  if (file.type === "image/webp") return "webp";
  if (file.type === "video/webm") return "webm";
  if (file.type === "video/quicktime") return "mov";
  return "mp4";
}

export async function createCommunityPost(caption: string, rating: number, files: File[]): Promise<CommunityPost> {
  const postId = crypto.randomUUID();
  const uploadedPaths: string[] = [];

  const { error: postError } = await supabase
    .from("community_posts")
    .insert({ id: postId, caption, rating });
  if (postError) throw postError;

  const mediaRows = [];
  for (const [position, file] of files.entries()) {
    const mediaId = crypto.randomUUID();
    const storagePath = `${postId}/${mediaId}.${safeExtension(file)}`;
    const { error: uploadError } = await supabase.storage
      .from(MEDIA_BUCKET)
      .upload(storagePath, file, { cacheControl: "3600", contentType: file.type, upsert: false });
    if (uploadError) throw uploadError;
    uploadedPaths.push(storagePath);
    mediaRows.push({
      id: mediaId,
      post_id: postId,
      storage_path: storagePath,
      file_name: file.name.slice(0, 255),
      media_type: file.type.startsWith("video/") ? "video" : "image",
      position,
    });
  }

  const { error: mediaError } = await supabase.from("community_media").insert(mediaRows);
  if (mediaError) throw mediaError;

  return {
    id: postId,
    caption,
    rating,
    createdAt: new Date().toISOString(),
    media: mediaRows.map((item, index) => ({
      id: item.id,
      name: files[index].name,
      type: item.media_type as "image" | "video",
      url: publicMediaUrl(item.storage_path),
    })),
    comments: [],
  };
}

export async function createCommunityComment(postId: string, text: string): Promise<CommunityComment> {
  const id = crypto.randomUUID();
  const createdAt = new Date().toISOString();
  const { error } = await supabase
    .from("community_comments")
    .insert({ id, post_id: postId, body: text });
  if (error) throw error;
  return { id, text, createdAt };
}

export async function deleteCommunityPost(postId: string, adminToken: string): Promise<void> {
  const { error } = await supabase.functions.invoke("community-admin", {
    body: { action: "delete", postId, token: adminToken },
  });
  if (error) throw error;
}
