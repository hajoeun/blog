import postsData from "@/src/posts.json";

export type Post = {
  id: string;
  date: string;
  title: string;
};

export const getPosts = async () => {
  return postsData.posts;
};
