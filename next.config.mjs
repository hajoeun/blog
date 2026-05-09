import createMDX from '@next/mdx';
import rehypePrettyCode from 'rehype-pretty-code';
import remarkFrontmatter from 'remark-frontmatter';
import remarkGfm from 'remark-gfm';
import remarkMdxFrontmatter from 'remark-mdx-frontmatter';

import postsData from './src/databases/legacy-posts.json' with { type: 'json' };

const withMDX = createMDX({
  options: {
    remarkPlugins: [remarkGfm, remarkFrontmatter, [remarkMdxFrontmatter, { name: 'metadata' }]],
    rehypePlugins: [rehypePrettyCode],
  },
});

export default withMDX({
  pageExtensions: ['ts', 'tsx', 'js', 'jsx', 'md', 'mdx'],
  reactStrictMode: true,
  poweredByHeader: false,
  eslint: {
    ignoreDuringBuilds: true,
  },
  redirects() {
    const posts = postsData.posts;
    const redirectPosts = posts.map((post) => ({
      source: `/${post.id}`,
      destination: `/${post.date.split('.')[0]}/${post.id}`,
      permanent: true,
    }));

    return [
      ...redirectPosts,
      { source: '/2022/retrospection-2021', destination: '/2021/retrospective', permanent: true },
      { source: '/2022/retrospection-2022', destination: '/2022/retrospective', permanent: true },
      { source: '/2023/retrospection-2023', destination: '/2023/retrospective', permanent: true },
    ];
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'i.ytimg.com',
        port: '',
      },
      {
        protocol: 'https',
        hostname: 'yt3.ggpht.com',
        port: '',
      },
    ],
  },
});
