// Definición del tipo original que viene de la API
export type Post = {
  id: number;
  title: string;
  content: string;
  postDate?: string;
  images: string[];
  authorId?: number;
  created_at?: string;
  updated_at?: string;
  author?: {
    id: number;
    name: string;
    surname: string;
    email?: string;
  };
  payload?: Post[];
};

// Definición del tipo que usarás en tu interfaz (transformado)
export type DisplayPost = {
  id: string;
  title: string;
  content: string;
  postDate: string;
  authorId: string;
  authorEmail?: string;
  authorName: string;
  images: string[];
};

export type PostsApiResponse = {
  total: number;
  payload: Post[];
  message: string;
};