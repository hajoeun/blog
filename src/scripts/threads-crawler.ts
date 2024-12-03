import { chromium } from 'playwright';

export async function getThreadsFollowers() {
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

    const response = await page.goto('https://www.threads.net/@hajoeun_', {
      waitUntil: 'domcontentloaded',
      timeout: 60000
    });

    if (!response) {
      throw new Error('페이지 로드 실패');
    }

    await Promise.race([
      page.waitForSelector('span[title]', { timeout: 30000 }),
      page.waitForSelector('section', { timeout: 30000 }),
      page.waitForSelector('[role="main"]', { timeout: 30000 })
    ]);

    await page.waitForTimeout(2000);

    const spans = await page.locator('span[title]').all();
    
    for (const span of spans) {
      const title = await span.getAttribute('title');
      if (title && /^[\d,]+$/.test(title)) {
        return parseInt(title.replace(/,/g, ''));
      }
    }

    throw new Error('팔로워 수를 찾을 수 없습니다.');
  } finally {
    await browser.close();
  }
}
