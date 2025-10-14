export type Post = {
  id: number;
  title: string;
  content: string;
  postDate?: string;
  images: string[];
  authorId?: number;
  created_at?: string;
  updated_at?: string;
};