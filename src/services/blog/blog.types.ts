export type PostStatusKey = "published" | "draft" | "scheduled";

export type Post = {
  id: number;
  title: string;
  author: string;
  date: string;
  views: number;
  st: PostStatusKey;
};

/** Payload for create/update — id is server-assigned and views is a metric. */
export type PostInput = Omit<Post, "id" | "views">;
