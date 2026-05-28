import { test, expect, navigateTo } from './helpers';

test.describe('Dashboard 总览页面', () => {
  test.beforeEach(async ({ page }) => {
    await navigateTo(page, 'dashboard');
  });

  test('页面标题显示正确', async ({ page }) => {
    await expect(page.locator('.page-title')).toHaveText('总览');
  });

  test('显示三个统计卡片', async ({ page }) => {
    const cards = page.locator('.stat-card');
    await expect(cards).toHaveCount(3);
  });

  test('统计卡片包含今日处理/今日成功/今日待处理', async ({ page }) => {
    const cardTexts = await page.locator('.stat-card').allTextContents();
    const allText = cardTexts.join(' ');
    expect(allText).toContain('今日处理');
    expect(allText).toContain('今日成功');
    expect(allText).toContain('今日待处理');
  });

  test('侧边栏高亮总览菜单', async ({ page }) => {
    await expect(page.locator('.menu-item.active')).toContainText('总览');
  });

  test('侧边栏包含所有菜单分组', async ({ page }) => {
    await expect(page.locator('.menu-group-title').nth(0)).toContainText('工作台');
    await expect(page.locator('.menu-group-title').nth(1)).toContainText('映射管理');
    await expect(page.locator('.menu-group-title').nth(2)).toContainText('交易查询');
  });

  test('点击侧边栏菜单可跳转', async ({ page }) => {
    await page.locator('.menu-item:has-text("支付指令")').click();
    await page.waitForLoadState('networkidle');
    await expect(page).toHaveURL(/payment-query\.html/);
  });
});
