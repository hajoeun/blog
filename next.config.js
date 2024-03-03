const postsData = require("./app/posts.json");
const withMDX = require("@next/mdx")();

module.exports = withMDX({
  pageExtensions: ["ts", "tsx", "js", "jsx", "md", "mdx"],
  experimental: {
    mdxRs: true,
  },
  swcMinify: true,
  reactStrictMode: true,
  images: {
    // FIXME: 이미지 최적화 설정
    remotePatterns: [
      {
        protocol: "https",
        hostname: "pbs.twimg.com",
        port: "",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "abs.twimg.com",
        port: "",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "m.media-amazon.com",
        port: "",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "images-na.ssl-images-amazon.com",
        port: "",
        pathname: "/**",
      },
    ],
  },
  headers() {
    return [
      {
        source: "/images/rauchg-3d4cecf.jpg",
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
