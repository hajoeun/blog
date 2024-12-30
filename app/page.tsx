import { PostList } from '@/components/post-list';
import { getPosts } from '@/utils/get-posts';

export const metadata = {
  title: 'hajoeun',
  description: 'hajoeun.com',
  openGraph: {
    title: 'hajoeun',
    description: 'hajoeun.com',
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
