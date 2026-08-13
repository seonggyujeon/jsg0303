export interface CommunityMedia {
  id: string;
  name: string;
  type: "image" | "video";
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

const POSTS_KEY = "ocean-log:community-posts:v1";
const DATABASE_NAME = "ocean-log-community";
const MEDIA_STORE = "media";

function openMediaDatabase(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    const request = window.indexedDB.open(DATABASE_NAME, 1);
    request.onupgradeneeded = () => {
      if (!request.result.objectStoreNames.contains(MEDIA_STORE)) request.result.createObjectStore(MEDIA_STORE);
    };
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

export function readCommunityPosts(): CommunityPost[] {
  try {
    const parsed = JSON.parse(window.localStorage.getItem(POSTS_KEY) ?? "[]") as CommunityPost[];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export function writeCommunityPosts(posts: CommunityPost[]): void {
  try {
    window.localStorage.setItem(POSTS_KEY, JSON.stringify(posts));
  } catch {
    // The current session still works if private browsing blocks persistence.
  }
}

export async function saveCommunityMedia(postId: string, files: File[]): Promise<CommunityMedia[]> {
  const database = await openMediaDatabase();
  const media = files.map((file, index) => ({
    id: `${postId}-${index}-${crypto.randomUUID()}`,
    name: file.name,
    type: file.type.startsWith("video/") ? "video" as const : "image" as const,
  }));
  await new Promise<void>((resolve, reject) => {
    const transaction = database.transaction(MEDIA_STORE, "readwrite");
    media.forEach((item, index) => transaction.objectStore(MEDIA_STORE).put(files[index], item.id));
    transaction.oncomplete = () => resolve();
    transaction.onerror = () => reject(transaction.error);
  });
  database.close();
  return media;
}

export async function readCommunityMedia(id: string): Promise<Blob | null> {
  const database = await openMediaDatabase();
  const result = await new Promise<Blob | null>((resolve, reject) => {
    const request = database.transaction(MEDIA_STORE, "readonly").objectStore(MEDIA_STORE).get(id);
    request.onsuccess = () => resolve(request.result instanceof Blob ? request.result : null);
    request.onerror = () => reject(request.error);
  });
  database.close();
  return result;
}
