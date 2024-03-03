import { getPosts } from "@/app/get-posts";
import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function GET() {
  return NextResponse.json(await getPosts());
}
