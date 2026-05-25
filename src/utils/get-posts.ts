import { sql } from '@vercel/postgres';
import fs from 'fs';
import matter from 'gray-matter';
import { join } from 'path';

import { mdxToHtml } from './mdx-to-html';
import { getPostFiles, type PostFile } from './post-files';
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
  videoId?: string;
};

const postRoot = join(process.cwd(), 'src/posts');

const getPostByFile = ({ id, year, slug, fullPath }: PostFile): Post => {
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
      videoId: row.video_id,
    };
  });
};

export const getPosts = async () => {
  const posts = getPostFiles(postRoot).map(getPostByFile);
  const videoPosts = await getVideoPosts();
  return [...posts, ...videoPosts].sort((post1, post2) => (post1.date > post2.date ? -1 : 1));
};

export const getPostsWithHtmlContent = async () => {
  const posts = await getPosts();
  return Promise.all(
    posts.map(async (post) => {
      const content = post.content ? await mdxToHtml(post.content) : '';
      return { ...post, content };
    })
  );
};
