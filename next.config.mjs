import remarkGfm from "remark-gfm";
import createMDX from "@next/mdx";
import postsData from "./app/posts.json" assert { type: "json" };

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
  headers() {
    return [
      {
        source: "/images/profile.png",
        headers: [
          {
            key: "cache-control",
            value: "public, max-age=31536000, immutable",
          },
        ],
      },
    ];
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
