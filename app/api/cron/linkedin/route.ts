import { NextResponse } from 'next/server';
import { getLinkedInFollowers } from '@/scripts/linkedin-crawler';
import { sql } from '@vercel/postgres';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
  try {
    // 인증 헤더 확인
    const authHeader = request.headers.get('authorization');
    if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    // 팔로워 수 가져오기
    const followers = await getLinkedInFollowers();
    
    // 현재 시간
    const now = new Date();
    const timestamp = now.toISOString();
    
    // Postgres에 저장
    await sql`
      INSERT INTO linkedin_stats (followers, timestamp)
      VALUES (${followers}, ${timestamp})
    `;

    return NextResponse.json({
      success: true,
      followers,
      timestamp
    });
  } catch (error) {
    console.error('LinkedIn stats 업데이트 실패:', error);
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
} 