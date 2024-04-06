import { getPosts } from '@/utils/get-posts';
import { parseDate } from '@/utils/parse-date';

export async function GET() {
  const posts = await getPosts();
  const max = 100; // max returned posts
  return new Response(
    `
    <?xml version="1.0" encoding="utf-8"?>
    <feed xmlns="http://www.w3.org/2005/Atom">
      <title>하조은의 블로그</title>
      <subtitle>hajoeun.com</subtitle>
      <link href="https://hajoeun.com/atom" rel="self"/>
      <link href="https://hajoeun.com/"/>
      <updated>${parseDate(posts[0].date).toISOString()}</updated>
      <id>https://hajoeun.com/</id>
      <author>
        <name>하조은</name>
        <email>hello@hajoeun.dev</email>
      </author>
      ${posts.slice(0, max).reduce((acc, post) => {
        const dateMatch = post.date.match(/\d{4}/);
        if (!dateMatch) return '';
        return `${acc}
          <entry>
            <id>${post.id}</id>
            <title>${post.title}</title>
            <link href="https://hajoeun.com/${dateMatch[0]}/${post.id}"/>
            <updated>${parseDate(post.date).toISOString()}</updated>
          </entry>`;
      }, '')}
    </feed>
  `,
    {
      headers: {
        'Content-Type': 'application/atom+xml; charset=utf-8',
      },
    }
  );
}
