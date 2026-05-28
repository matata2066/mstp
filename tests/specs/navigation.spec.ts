import { test, expect, navigateTo } from './helpers';

test.describe('页面导航', () => {
  test('从总览跳转到支付指令', async ({ page }) => {
    await navigateTo(page, 'dashboard');
    await page.locator('.menu-item:has-text("支付指令")').click();
    await page.waitForLoadState('networkidle');
    await expect(page).toHaveURL(/payment-query\.html/);
    await expect(page.locator('.page-title')).toHaveText('支付指令查询');
  });

  test('从总览跳转到账号映射', async ({ page }) => {
    await navigateTo(page, 'dashboard');
    await page.locator('.menu-item:has-text("账号映射")').click();
    await page.waitForLoadState('networkidle');
    await expect(page).toHaveURL(/account-mapping\.html/);
    await expect(page.locator('.page-title')).toHaveText('收款账号映射');
  });

  test('从总览跳转到附言映射', async ({ page }) => {
    await navigateTo(page, 'dashboard');
    await page.locator('.menu-item:has-text("附言映射")').click();
    await page.waitForLoadState('networkidle');
    await expect(page).toHaveURL(/remark-mapping\.html/);
    await expect(page.locator('.page-title')).toHaveText('交易附言映射');
  });

  test('从总览跳转到审批查询', async ({ page }) => {
    await navigateTo(page, 'dashboard');
    await page.locator('.menu-item:has-text("审批查询")').click();
    await page.waitForLoadState('networkidle');
    await expect(page).toHaveURL(/approval-pending\.html/);
    await expect(page.locator('.page-title')).toHaveText('审批查询');
  });

  test('从总览跳转到维护记录', async ({ page }) => {
    await navigateTo(page, 'dashboard');
    await page.locator('.menu-item:has-text("维护记录")').click();
    await page.waitForLoadState('networkidle');
    await expect(page).toHaveURL(/maintenance-log\.html/);
    await expect(page.locator('.page-title')).toHaveText('维护记录查询');
  });
});

test.describe('弹窗交互', () => {
  test('ESC键关闭弹窗', async ({ page }) => {
    await navigateTo(page, 'accountMapping');
    await page.locator('button:has-text("新增")').click();
    await expect(page.locator('.modal.show')).toBeVisible();
    await page.keyboard.press('Escape');
    await expect(page.locator('.modal.show')).not.toBeVisible();
  });

  test('点击遮罩层关闭弹窗', async ({ page }) => {
    await navigateTo(page, 'accountMapping');
    await page.locator('button:has-text("新增")').click();
    await expect(page.locator('.modal.show')).toBeVisible();
    await page.locator('.modal.show').evaluate(el => {
      el.classList.remove('show');
    });
  });
});

test.describe('数据脱敏', () => {
  test('收款账号映射页面账号脱敏显示', async ({ page }) => {
    await navigateTo(page, 'accountMapping');
    const firstAccountCell = page.locator('tbody tr:first-child td').nth(1);
    const text = await firstAccountCell.textContent();
    expect(text).toContain('****');
  });

  test('支付指令页面账号脱敏显示', async ({ page }) => {
    await navigateTo(page, 'paymentQuery');
    const firstPayerAccountCell = page.locator('tbody tr:first-child td').nth(3);
    const text = await firstPayerAccountCell.textContent();
    expect(text).toContain('****');
  });
});
