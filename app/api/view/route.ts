export const runtime = "edge";

import { kv } from "@vercel/kv";
import commaNumber from "comma-number";
import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

import postsData from "@/src/posts.json";

export async function GET(req: NextRequest) {
  const url = new URL(req.url);
  const id = url.searchParams.get("id") ?? null;

  if (id === null) {
    return NextResponse.json(
      {
        error: {
          message: 'Missing "id" query',
          code: "MISSING_ID",
        },
      },
      { status: 400 }
    );
  }

  const post = postsData.posts.find(post => post.id === id);

  if (post == null) {
    return NextResponse.json(
      {
        error: {
          message: "Unknown post",
          code: "UNKNOWN_POST",
        },
      },
      { status: 400 }
    );
  }

  if (url.searchParams.get("incr") != null) {
    const views = await kv.hincrby("views", id, 1);
    return NextResponse.json({
      ...post,
      views,
      viewsFormatted: commaNumber(views),
    });
  } else {
    const views = (await kv.hget("views", id)) ?? 0;
    return NextResponse.json({
      ...post,
      views,
      viewsFormatted: commaNumber(Number(views)),
    });
  }
}
