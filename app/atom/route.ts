import RSS from 'rss';

import { getPostsWithHtmlContent } from '@/utils/get-posts';

export async function GET() {
  const posts = await getPostsWithHtmlContent();

  const feed = new RSS({
    title: '하조은의 글간',
    site_url: 'https://hajoeun.com',
    feed_url: 'https://hajoeun.com/atom',
    description: '하조은의 글간',
  });

  posts.forEach((post) => {
    feed.item({
      title: post.title,
      url: `https://hajoeun.com/${post.slug}`,
      date: new Date(post.date),
      description: post.content,
    });
  });

  return new Response(feed.xml({ indent: true }), {
    headers: {
      'Content-Type': 'application/atom+xml; charset=utf-8',
    },
  });
}
