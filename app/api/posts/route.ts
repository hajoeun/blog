import { getPosts } from "@/src/utils/get-posts";
import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function GET() {
  return NextResponse.json(await getPosts());
}
