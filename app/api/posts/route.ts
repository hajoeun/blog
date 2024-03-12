import { NextResponse } from "next/server";

import { getPosts } from "@/src/utils/get-posts";

export const dynamic = "force-dynamic";

export async function GET() {
  return NextResponse.json(await getPosts());
}
