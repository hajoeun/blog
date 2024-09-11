import { getPosts } from '@/utils/get-posts';
import { ImageResponse } from 'next/og';

export async function GET(_, { params: { id } }) {
  const posts = getPosts();
  const post = posts.find((post) => post.id === id);
  const title = post?.title || '하조은의 블로그';

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
            fontSize: 130,
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
