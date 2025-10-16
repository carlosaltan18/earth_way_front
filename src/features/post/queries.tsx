import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { postApi } from "./api";
import type { Post } from "./types";

export const postKeys = {
  all: ["posts"] as const,
  lists: () => [...postKeys.all, "list"] as const,
  list: () => [...postKeys.lists()] as const,
};

export const useListPosts = () => {
  return useQuery({
    queryKey: postKeys.list(),
    queryFn: () => postApi.list(),
  });
};

export const useCreatePost = () => {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: (post: Omit<Post, "id">) => postApi.create(post),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: postKeys.all });
    },
  });
};

export const useUpdatePost = () => {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: ({ id, userId, post }: { id: number; userId: number; post: Omit<Post, "id"> }) =>
      postApi.update(id, userId, post),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: postKeys.all });
    },
  });
};

export const useDeletePostByUser = () => {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: ({ id, userId }: { id: number; userId: number }) => postApi.deleteByUser(id, userId),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: postKeys.all });
    },
  });
};

export const useDeletePostByAdmin = () => {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => postApi.deleteByAdmin(id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: postKeys.all });
    },
  });
};