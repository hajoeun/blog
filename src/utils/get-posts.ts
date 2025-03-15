import { sql } from '@vercel/postgres';
import fs from 'fs';
import matter from 'gray-matter';
import { join } from 'path';

import { mdxToHtml } from './mdx-to-html';
import { convertToKST } from './parse-date';

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

export const getVideoPosts = async (): Promise<Post[]> => {
  const { rows } = await sql`
    SELECT id, video_id, title, status, published_at, content
    FROM youtube_posts
    WHERE status = 'completed'
    ORDER BY published_at DESC
  `;

  return rows.map((row) => {
    const publishedAt = convertToKST(row.published_at);
    const year = publishedAt.getFullYear().toString();
    const slug = `${year}/${row.video_id}`;
    const { data, content } = matter(row.content);

    return {
      id: row.video_id,
      year,
      slug,
      title: row.title,
      description: data.description,
      content,
      date: publishedAt.toISOString(),
    };
  });
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
