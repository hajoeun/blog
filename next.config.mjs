import createMDX from "@next/mdx";
import remarkGfm from "remark-gfm";

import postsData from "./src/posts.json" assert { type: "json" };

const withMDX = createMDX({
  options: {
    remarkPlugins: [remarkGfm],
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

    return [...redirectPosts];
  },
});
