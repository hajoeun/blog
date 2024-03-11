export const runtime = "edge";
export const revalidate = 60;

import { ImageResponse } from "next/og";
import { getPosts } from "@/app/get-posts";

export default async function MainOG() {
  // fonts
  const notoSans300 = fetch(
    new URL(
      `../node_modules/@fontsource/noto-sans-kr/files/noto-sans-kr-latin-300-normal.woff`,
      import.meta.url
    )
  ).then(res => res.arrayBuffer());

  const notoSans600 = fetch(
    new URL(
      `../node_modules/@fontsource/noto-sans-kr/files/noto-sans-kr-latin-600-normal.woff`,
      import.meta.url
    )
  ).then(res => res.arrayBuffer());

  const robotoMono400 = fetch(
    new URL(
      `../node_modules/@fontsource/roboto-mono/files/roboto-mono-latin-400-normal.woff`,
      import.meta.url
    )
  ).then(res => res.arrayBuffer());

  const posts = await getPosts();
  const sortedPosts = [...posts].sort((a, b) => {
    return new Date(b.date).getTime() - new Date(a.date).getTime();
  });

  return new ImageResponse(
    (
      <div tw="flex p-10 h-full w-full bg-white flex-col">
        <header tw="flex text-[36px] w-full">
          <div tw="font-bold" style={font("Noto Sans 600")}>
            하조은의 블로그
          </div>
          <div tw="grow" />
          <div tw="text-[28px]" style={font("Noto Sans 300")}>
            hajoeun.com
          </div>
        </header>

        <main tw="flex mt-10 flex-col w-full" style={font("Roboto Mono 400")}>
          <div tw="flex w-full text-[26px] text-gray-400 mb-3">
            <div tw="w-24">date</div>
            <div tw="grow">title</div>
            {/* FIXME: views */}
            {/* <div>views</div> */}
          </div>

          {sortedPosts.map((post, i) => (
            <div
              key={post.id}
              tw="flex py-6 text-[26px] border-gray-300 border-t w-full"
            >
              <div tw="flex text-gray-400 w-24">
                {posts[i - 1] === undefined ||
                getYear(post.date) !== getYear(posts[i - 1].date)
                  ? getYear(post.date)
                  : ""}
              </div>
              <div tw="flex grow">{post.title}</div>
              {/* FIXME: views */}
              {/* <div tw="flex text-gray-400 pl-7">{post?.viewsFormatted}</div> */}
            </div>
          ))}
        </main>
      </div>
    ),
    {
      width: 1200,
      height: 630,
      fonts: [
        {
          name: "Noto Sans 300",
          data: await notoSans300,
        },
        {
          name: "Noto Sans 600",
          data: await notoSans600,
        },
        {
          name: "Roboto Mono 400",
          data: await robotoMono400,
        },
      ],
    }
  );
}

// lil helper to convert posts.json `date` to full year
function getYear(date: string) {
  return new Date(date).getFullYear();
}

// lil helper for more succinct styles
function font(fontFamily: string) {
  return { fontFamily };
}
