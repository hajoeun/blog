import fs from 'fs';
import matter from 'gray-matter';
import { join } from 'path';

export type Post = {
  id: string;
  year: string;
  slug: string;
  title: string;
  description: string;
  content: string;
  date: string;
};

const postRoot = join(process.cwd(), 'app/(post)');

export const getPostSlugs = () => {
  const dirs = fs.readdirSync(postRoot, { recursive: true });
  const paths = dirs.map((path) => path);

  return paths.filter((path) => path.split('/').length === 2);
};

export const getPostBySlug = (slug: string): Post => {
  const [year, id] = slug.split('/');
  const fullPath = join(postRoot, `${slug}/page.mdx`);
  const fileContents = fs.readFileSync(fullPath, 'utf8');
  const { data, content } = matter(fileContents);

  return {
    id,
    year,
    slug,
    content,
    title: data.title,
    description: data.description,
    date: data.date,
  };
};

export const getPosts = () => {
  const slugs = getPostSlugs();
  const posts = slugs.map(getPostBySlug).sort((post1, post2) => (post1.date > post2.date ? -1 : 1));

  return posts;
};
