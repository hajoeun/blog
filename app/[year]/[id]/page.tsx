import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { MDXRemote } from 'next-mdx-remote/rsc';

import { PostHeader } from '@/components/post-header';
import components from '@/components/ui';
import { getPosts } from '@/utils/get-posts';

export const generateMetadata = async ({ params }): Promise<Metadata> => {
  const { year, id } = await params;
  const posts = getPosts();

  const post = posts.find((post) => post.year === year && post.id === id);
  const ogImage = post?.image ? post.image : '/opengraph-image.png';

  return {
    title: post?.title,
    description: post?.description,
    openGraph: {
      publishedTime: post?.date,
      images: [ogImage],
    },
  };
};

const Post = async ({ params }) => {
  const { year, id } = await params;
  const posts = getPosts();

  const post = posts.find((post) => post.year === year && post.id === id);

  if (!post) return notFound();

  return (
    <article className="text-gray-800 dark:text-gray-300 mb-10">
      <PostHeader post={post} />
      <MDXRemote source={post.content} components={components} />
    </article>
  );
};

export default Post;
