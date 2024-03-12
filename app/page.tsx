import { PostList } from "@/src/components/post-list";
import { getPosts } from "@/src/utils/get-posts";

export const revalidate = 60;

export default async function Home() {
  const posts = await getPosts();
  return <PostList posts={posts} />;
}
