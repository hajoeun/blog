import { getPostBySlug } from '@/utils/get-posts';
import { ImageResponse } from 'next/og';

export const runtime = 'edge';

export async function GET(_, { params: { slug } }) {
  const post = await getPostBySlug(slug);
  const font = fetch(new URL('../../public/fonts/kaisei-tokumin-bold.ttf', import.meta.url)).then(
    (res) => res.arrayBuffer()
  );
  const fontData = await font;

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
          backgroundImage: 'url(https://hajoeun.com/opengraph-image.png)',
        }}
      >
        <div
          style={{
            marginLeft: 190,
            marginRight: 190,
            display: 'flex',
            fontSize: 130,
            fontFamily: 'Kaisei Tokumin',
            letterSpacing: '-0.05em',
            fontStyle: 'normal',
            color: 'white',
            lineHeight: '120px',
            whiteSpace: 'pre-wrap',
          }}
        >
          {post.title}
        </div>
      </div>
    ),
    {
      width: 1920,
      height: 1080,
      fonts: [
        {
          name: 'Kaisei Tokumin',
          data: fontData,
          style: 'normal',
        },
      ],
    }
  );
}
