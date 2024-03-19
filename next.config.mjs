import createMDX from "@next/mdx";
import rehypePrettyCode from "rehype-pretty-code";
import remarkGfm from "remark-gfm";

import postsData from "./src/posts.json" assert { type: "json" };

const withMDX = createMDX({
  options: {
    remarkPlugins: [remarkGfm],
    rehypePlugins: [rehypePrettyCode],
  },
});

export default withMDX({
  pageExtensions: ["ts", "tsx", "js", "jsx", "md", "mdx"],
  swcMinify: true,
  reactStrictMode: true,
  images: {
    remotePatterns: [],
  },
  redirects() {
    const posts = postsData.posts;
    const redirectPosts = posts.map(post => ({
      source: `/${post.id}`,
      destination: `/${post.date.split(".")[0]}/${post.id}`,
      permanent: true,
    }));
    const redirectOgImages = posts.map(post => ({
      source: `/og/${post.id}`,
      destination: `/opengraph-image.png`,
      permanent: false,
    }));

    return [...redirectPosts, ...redirectOgImages];
  },
});
