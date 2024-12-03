import { chromium } from 'playwright';

export async function getLinkedInFollowers() {
  const browser = await chromium.launch({
    headless: true
  });

  try {
    const context = await browser.newContext({
      viewport: { width: 1920, height: 1080 },
      deviceScaleFactor: 2,
      userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/119.0.0.0 Safari/537.36',
      locale: 'ko-KR',
      timezoneId: 'Asia/Seoul'
    });

    const page = await context.newPage();
    page.setDefaultTimeout(60000);
    page.setDefaultNavigationTimeout(60000);

    const response = await page.goto('https://www.linkedin.com/posts/hajoeun_%EC%9A%B0%EB%A6%AC%EB%8A%94-%EB%AA%A8%EB%91%90-%EC%98%A8%EB%9D%BC%EC%9D%B8-%EC%86%8D-%EC%9E%90%EC%8B%A0%EB%A7%8C%EC%9D%98-%EA%B3%B5%EA%B0%84%EC%9D%84-%EA%B0%96%EA%B3%A0-%EC%9E%88%EC%8A%B5%EB%8B%88%EB%8B%A4-%EC%86%8C%EC%85%9C-%EB%AF%B8%EB%94%94%EC%96%B4-sns%EB%A1%9C-activity-7229438902950838274-mHLu', {
      waitUntil: 'domcontentloaded',
      timeout: 60000
    });

    if (!response) {
      throw new Error('페이지 로드 실패');
    }

    // 팔로워 수가 포함된 요소 대기
    await page.waitForSelector('.public-post-author-card__followers', { timeout: 30000 });
    await page.waitForTimeout(2000);

    // 팔로워 수 텍스트 추출
    const followerText = await page.locator('.public-post-author-card__followers').textContent();
    if (!followerText) {
      throw new Error('팔로워 수를 찾을 수 없습니다.');
    }

    // 숫자 추출 (예: "5,386 followers" -> "5,386")
    const match = followerText.match(/(\d+,?\d*)/);
    if (!match) {
      throw new Error('팔로워 수 형식이 올바르지 않습니다.');
    }

    // 쉼표 제거 후 숫자로 변환
    return parseInt(match[1].replace(/,/g, ''));

  } finally {
    await browser.close();
  }
}

