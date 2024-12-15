import fs from 'fs';
import matter from 'gray-matter';
import { join } from 'path';

import { mdxToHtml } from './mdx-to-html';

export type Post = {
  id: string;
  year: string;
  slug: string;
  title: string;
  description: string;
  date: string;
  content: string;
  image?: string;
};

const postRoot = join(process.cwd(), 'src/posts');

const getPostSlugs = () => {
  const dirs = fs.readdirSync(postRoot, { recursive: true });
  const paths = dirs.map((path) => path);

  return paths
    .filter((path) => path.split('/').length === 2)
    .map((path) => path.replace(/\.mdx$/, ''));
};

const getPostBySlug = (slug: string): Post => {
  const [year, id] = slug.split('/');
  const fullPath = join(postRoot, `${slug}.mdx`);
  const fileContents = fs.readFileSync(fullPath, 'utf8');
  const { data, content } = matter(fileContents);

  return {
    id,
    year,
    slug,
    title: data.title,
    description: data.description,
    date: data.date,
    content,
    image: data.openGraph?.images[0],
  };
};

export const getPosts = () => {
  const slugs = getPostSlugs();
  const posts = slugs.map(getPostBySlug).sort((post1, post2) => (post1.date > post2.date ? -1 : 1));

  return posts;
};

export const getPostsWithHtmlContent = async () => {
  const posts = getPosts();
  return Promise.all(
    posts.map(async (post) => {
      const content = post.content ? await mdxToHtml(post.content) : '';
      return { ...post, content };
    })
  );
};
