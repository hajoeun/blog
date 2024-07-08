import { PostHeader } from '@/components/post-header';
import { getPosts } from '@/utils/get-posts';

export const revalidate = 60;

export default async function Layout({ children }) {
  const posts = getPosts();

  return (
    <article className="text-gray-800 dark:text-gray-300 mb-10">
      <PostHeader posts={posts} />

      {children}
    </article>
  );
}
