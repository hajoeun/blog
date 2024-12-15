import { getPosts } from '@/utils/get-posts';
import { mdxToHtml } from '@/utils/mdx-to-html';

export async function GET() {
  const posts = getPosts();
  const max = 100; // max returned posts

  const feed = await Promise.all(
    posts.slice(0, max).map(async (post) => {
      const content = post.content ? await mdxToHtml(post.content) : '';
      return `<entry>
    <id>https://hajoeun.com/${post.slug}</id>
    <title>${post.title}</title>
    <link href="https://hajoeun.com/${post.slug}"/>
    <updated>${new Date(post.date).toISOString()}</updated>
    <content type="html"><![CDATA[${content}]]></content>
    <author>
      <name>하조은</name>
    </author>
  </entry>`;
    })
  );

  return new Response(
    `<?xml version="1.0" encoding="utf-8"?>
<feed xmlns="http://www.w3.org/2005/Atom">
  <title>하조은의 블로그</title>
  <subtitle>hajoeun.com</subtitle>
  <link href="https://hajoeun.com/feed/atom" rel="self" type="application/atom+xml"/>
  <link href="https://hajoeun.com"/>
  <updated>${new Date(posts[0].date).toISOString()}</updated>
  <id>https://hajoeun.com/</id>
  <author>
    <name>하조은</name>
    <email>hello@hajoeun.com</email>
  </author>${feed.join('')}
</feed>`,
    {
      headers: {
        'Content-Type': 'application/atom+xml; charset=utf-8',
      },
    }
  );
}
