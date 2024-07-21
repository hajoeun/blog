import { PostList } from '@/components/post-list';
import { getPosts } from '@/utils/get-posts';

export default async function Home() {
  const posts = getPosts();
  return <PostList posts={posts} />;
}
