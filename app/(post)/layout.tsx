import { PostHeader } from "@/src/components/post-header";
import { getPosts } from "@/src/utils/get-posts";

export const revalidate = 60;

export default async function Layout({ children }) {
  const posts = await getPosts();

  return (
    <article className="text-gray-800 dark:text-gray-300 mb-10">
      <PostHeader posts={posts} />

      {children}
    </article>
  );
}
