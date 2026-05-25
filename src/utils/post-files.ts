import fs from 'fs';
import { extname, join } from 'path';

const POST_EXTENSIONS = ['.mdx', '.md'] as const;

export type PostExtension = (typeof POST_EXTENSIONS)[number];

export type PostFile = {
  id: string;
  year: string;
  slug: string;
  fullPath: string;
  extension: PostExtension;
};

const isPostExtension = (extension: string): extension is PostExtension => {
  return POST_EXTENSIONS.includes(extension as PostExtension);
};

export const getPostFiles = (postRoot: string): PostFile[] => {
  const paths = fs
    .readdirSync(postRoot, { recursive: true })
    .map((path) => path.toString().replace(/\\/g, '/'))
    .filter((path) => path.split('/').length === 2);

  const seen = new Map<string, PostFile>();
  const postFiles: PostFile[] = [];

  paths.forEach((relativePath) => {
    const extension = extname(relativePath);
    if (!isPostExtension(extension)) return;

    const slug = relativePath.slice(0, -extension.length);
    const [year, id] = slug.split('/');
    const postFile = {
      id,
      year,
      slug,
      fullPath: join(postRoot, relativePath),
      extension,
    };
    const duplicate = seen.get(slug);

    if (duplicate) {
      throw new Error(
        `Duplicate post slug "${slug}" found in ${duplicate.fullPath} and ${postFile.fullPath}. Keep only one file per slug.`
      );
    }

    seen.set(slug, postFile);
    postFiles.push(postFile);
  });

  return postFiles.sort((postFile1, postFile2) => postFile1.slug.localeCompare(postFile2.slug));
};
