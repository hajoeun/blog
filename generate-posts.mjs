import fs from 'fs';
import matter from 'gray-matter';
import { join } from 'path';

const postRoot = join(process.cwd(), 'app/(post)');
const dbRoot = join(process.cwd(), 'src/databases');

const getPostSlugs = () => {
  const dirs = fs.readdirSync(postRoot, { recursive: true });
  const paths = dirs.map((path) => path);

  return paths.filter((path) => path.split('/').length === 2);
};

const getPostBySlug = (slug) => {
  const [year, id] = slug.split('/');
  const fullPath = join(postRoot, `${slug}/page.mdx`);
  const fileContents = fs.readFileSync(fullPath, 'utf8');
  const { data } = matter(fileContents);

  return {
    id,
    year,
    slug,
    title: data.title,
    description: data.description,
    date: data.date,
  };
};

const getPosts = () => {
  const slugs = getPostSlugs();
  const posts = slugs.map(getPostBySlug).sort((post1, post2) => (post1.date > post2.date ? -1 : 1));

  return posts;
};

const setPosts = (posts) => {
  const jsonPosts = JSON.stringify(posts, null, 2);
  fs.writeFileSync(join(dbRoot, 'posts.json'), jsonPosts, 'utf8');
};

const posts = getPosts();
setPosts(posts);
