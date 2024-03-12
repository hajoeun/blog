export const runtime = "edge";
export const revalidate = 60;

import commaNumber from "comma-number";
import { ImageResponse } from "next/og";

import { getPosts } from "@/src/utils/get-posts";

export default async function AboutOG() {
  const hajoeunPhoto = fetch(
    new URL(`../../public/images/profile.png`, import.meta.url)
  ).then(res => res.arrayBuffer());

  // fonts
  const notoSans300 = fetch(
    new URL(
      `../../node_modules/@fontsource/noto-sans-kr/files/noto-sans-kr-latin-300-normal.woff`,
      import.meta.url
    )
  ).then(res => res.arrayBuffer());

  const notoSans500 = fetch(
    new URL(
      `../../node_modules/@fontsource/noto-sans-kr/files/noto-sans-kr-latin-500-normal.woff`,
      import.meta.url
    )
  ).then(res => res.arrayBuffer());

  const robotoMono400 = fetch(
    new URL(
      `../../node_modules/@fontsource/roboto-mono/files/roboto-mono-latin-400-normal.woff`,
      import.meta.url
    )
  ).then(res => res.arrayBuffer());

  const posts = await getPosts();
  const viewsSum = posts.reduce((sum, post) => sum + post.views, 0);

  return new ImageResponse(
    (
      <div
        tw="flex p-10 h-full w-full bg-white flex-col"
        style={font("Noto Sans 300")}
      >
        <main tw="flex grow pt-4 w-full justify-center items-center">
          <div tw="flex flex-row">
            <div tw="flex">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                tw="rounded-full h-74"
                alt="하조은"
                // @ts-ignore
                src={await hajoeunPhoto}
              />
            </div>

            <div tw="flex flex-col px-10 grow text-[28px] h-70 justify-center">
              <div tw="text-[64px] mb-7" style={font("Noto Sans 500")}>
                하조은
              </div>
              <div tw="flex mb-5" style={font("Roboto Mono 400")}>
                <span tw="text-gray-400 mr-3">&mdash;</span> 당근 Software
                Engineer
              </div>
              <div tw="flex mb-5" style={font("Roboto Mono 400")}>
                <span tw="text-gray-400 mr-3">&mdash;</span> 뱅크샐러드
                Engineering Manager
              </div>
              <div tw="flex" style={font("Roboto Mono 400")}>
                <span tw="text-gray-400 mr-3">&mdash;</span> 마플 Software
                Engineer
              </div>
            </div>
          </div>
        </main>

        <footer
          tw="flex w-full justify-center text-2xl text-gray-500"
          style={font("Roboto Mono 400")}
        >
          {posts.length} posts / {commaNumber(viewsSum)} views
        </footer>
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
          name: "Noto Sans 500",
          data: await notoSans500,
        },
        {
          name: "Roboto Mono 400",
          data: await robotoMono400,
        },
      ],
    }
  );
}

// lil helper for more succinct styles
function font(fontFamily: string) {
  return { fontFamily };
}
