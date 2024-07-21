import { ImageResponse } from 'next/og';

export const runtime = 'edge';

export async function GET(_, { params: { id } }) {
  const posts = await fetch(new URL('../../../src/databases/posts.json', import.meta.url)).then(
    (res) => res.json()
  );
  const post = posts.find((post) => post.id === id);

  const fontData = await fetch(
    new URL('../../../public/fonts/nanum-square-extra-bold.otf', import.meta.url)
  ).then((res) => res.arrayBuffer());

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
            marginLeft: 120,
            marginRight: 190,
            paddingBottom: 190,
            display: 'flex',
            fontSize: 130,
            fontFamily: 'Nanum Square',
            letterSpacing: '-0.05em',
            fontStyle: 'normal',
            color: '#fefcfc',
            lineHeight: '180px',
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
          name: 'Nanum Square',
          data: fontData,
          style: 'normal',
        },
      ],
    }
  );
}
