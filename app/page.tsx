import { PostList } from '@/components/post-list';
import { getPosts } from '@/utils/get-posts';

export const metadata = {
  title: 'hajoeun.com/posts',
  description: '하조은의 글간',
  openGraph: {
    title: 'hajoeun.com/posts',
    description: '하조은의 글간',
    url: 'https://hajoeun.com',
    siteName: 'hajoeun.com',
  },
  twitter: {
    card: 'summary_large_image',
    site: '@hajoeun_',
    creator: '@hajoeun_',
  },
  metadataBase: new URL('https://hajoeun.com'),
};

export default async function Home() {
  const posts = getPosts();
  return <PostList posts={posts} />;
}
