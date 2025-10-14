export type Report = {
  id: number;
  title: string;
  description: string;
  reportDate?: string;
  authorId?: number;
  created_at?: string;
  updated_at?: string;
};

export type GetReportsParams = {
  page?: number;
  size?: number;
};