import components from '@/components/ui';
import { PostHeader } from '@/components/post-header';
import { getPosts } from '@/utils/get-posts';
import { notFound } from 'next/navigation';
import { MDXRemote } from 'next-mdx-remote/rsc';
import { Metadata } from 'next';

export const generateMetadata = ({ params }): Metadata => {
  const posts = getPosts();
  const post = posts.find((post) => post.year === params.year && post.id === params.id);
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
  const posts = getPosts();
  const post = posts.find((post) => post.year === params.year && post.id === params.id);

  if (!post) return notFound();

  return (
    <article className="text-gray-800 dark:text-gray-300 mb-10">
      <PostHeader post={post} />
      <MDXRemote source={post.content} components={components} />
    </article>
  );
};

export default Post;
