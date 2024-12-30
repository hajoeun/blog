import { ImageResponse } from 'next/og';

import { getPosts } from '@/utils/get-posts';

export async function GET(request, { params }) {
  const searchParams = request.nextUrl.searchParams;
  const year = searchParams.get('year');
  const { id } = await params;

  const posts = getPosts();
  const post = posts.find((post) => {
    if (!year) return post.id === id;
    return post.id === id && post.year === year;
  });
  const title = post?.title || 'hajoeun.com';

  return new ImageResponse(
    (
      <div
        style={{
          height: '100%',
          width: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'flex-start',
          justifyContent: 'center',
          backgroundImage: 'url(https://hajoeun.com/og-background.png)',
          backgroundColor: '#242424',
        }}
      >
        <div
          style={{
            marginLeft: 160,
            marginRight: 190,
            paddingBottom: 190,
            display: 'flex',
            fontSize: 105,
            letterSpacing: '-0.05em',
            fontStyle: 'normal',
            color: '#fefcfc',
            lineHeight: '180px',
            whiteSpace: 'pre-wrap',
          }}
        >
          {title}
        </div>
      </div>
    ),
    {
      width: 1920,
      height: 1080,
    }
  );
}
