import { test, expect, navigateTo, openDetailByDblClick, closeModal, getTableRowCount } from './helpers';

test.describe('收款账号映射页面', () => {
  test.beforeEach(async ({ page }) => {
    await navigateTo(page, 'accountMapping');
  });

  test('页面标题显示正确', async ({ page }) => {
    await expect(page.locator('.page-title')).toHaveText('收款账号映射');
  });

  test('表格有数据行', async ({ page }) => {
    const count = await getTableRowCount(page);
    expect(count).toBeGreaterThan(0);
  });

  test('表头包含所有列', async ({ page }) => {
    const headers = page.locator('thead th');
    const headerTexts = await headers.allTextContents();
    expect(headerTexts).toContain('收款账号');
    expect(headerTexts).toContain('账户名称');
    expect(headerTexts).toContain('支付通道');
    expect(headerTexts).toContain('状态');
  });

  test('双击行打开详情弹窗', async ({ page }) => {
    await openDetailByDblClick(page, 0);
    await expect(page.locator('.modal.show .modal-title')).toContainText('收款账号映射详情');
  });

  test('详情弹窗显示审批信息', async ({ page }) => {
    await openDetailByDblClick(page, 0);
    const body = page.locator('.modal.show .modal-body');
    await expect(body).toContainText('制单人');
    await expect(body).toContainText('审批人');
  });

  test('关闭详情弹窗', async ({ page }) => {
    await openDetailByDblClick(page, 0);
    await closeModal(page);
  });

  test('点击新增按钮打开新增弹窗', async ({ page }) => {
    await page.locator('button:has-text("新增")').click();
    await expect(page.locator('.modal.show .modal-title')).toContainText('新增收款账号映射');
  });

  test('新增弹窗包含必填字段', async ({ page }) => {
    await page.locator('button:has-text("新增")').click();
    const modal = page.locator('.modal.show');
    await expect(modal).toContainText('收款账号');
    await expect(modal).toContainText('账户名称');
    await expect(modal).toContainText('支付通道');
  });

  test('点击详情按钮打开弹窗', async ({ page }) => {
    await page.locator('tbody tr:first-child .btn-link:has-text("详情")').click();
    await expect(page.locator('.modal.show')).toBeVisible();
  });
});

test.describe('行号映射页面', () => {
  test.beforeEach(async ({ page }) => {
    await navigateTo(page, 'bankMapping');
  });

  test('页面标题显示正确', async ({ page }) => {
    await expect(page.locator('.page-title')).toHaveText('行号映射');
  });

  test('表格有数据行', async ({ page }) => {
    const count = await getTableRowCount(page);
    expect(count).toBeGreaterThan(0);
  });

  test('双击行打开详情弹窗', async ({ page }) => {
    await openDetailByDblClick(page, 0);
    await expect(page.locator('.modal.show .modal-title')).toContainText('行号映射详情');
  });
});

test.describe('交易附言映射页面', () => {
  test.beforeEach(async ({ page }) => {
    await navigateTo(page, 'remarkMapping');
  });

  test('页面标题显示正确', async ({ page }) => {
    await expect(page.locator('.page-title')).toHaveText('交易附言映射');
  });

  test('表格有数据行', async ({ page }) => {
    const count = await getTableRowCount(page);
    expect(count).toBeGreaterThan(0);
  });

  test('表头包含匹配模式和中文附言列', async ({ page }) => {
    const headers = page.locator('thead th');
    const headerTexts = await headers.allTextContents();
    expect(headerTexts).toContain('匹配模式');
    expect(headerTexts).toContain('中文附言');
  });

  test('前缀匹配模式有标记', async ({ page }) => {
    const prefixRows = page.locator('tbody tr');
    const count = await prefixRows.count();
    let foundPrefix = false;
    for (let i = 0; i < count; i++) {
      const text = await prefixRows.nth(i).textContent();
      if (text?.includes('前缀匹配')) {
        foundPrefix = true;
        break;
      }
    }
    expect(foundPrefix).toBeTruthy();
  });

  test('双击行打开详情弹窗', async ({ page }) => {
    await openDetailByDblClick(page, 0);
    await expect(page.locator('.modal.show .modal-title')).toContainText('交易附言映射详情');
  });

  test('点击新增按钮打开新增弹窗', async ({ page }) => {
    await page.locator('button:has-text("新增")').click();
    await expect(page.locator('.modal.show .modal-title')).toContainText('新增交易附言映射');
  });
});

test.describe('付款账号配置页面', () => {
  test.beforeEach(async ({ page }) => {
    await navigateTo(page, 'payerConfig');
  });

  test('页面标题显示正确', async ({ page }) => {
    await expect(page.locator('.page-title')).toHaveText('付款账号配置');
  });

  test('表格有数据行', async ({ page }) => {
    const count = await getTableRowCount(page);
    expect(count).toBeGreaterThan(0);
  });

  test('双击行打开详情弹窗', async ({ page }) => {
    await openDetailByDblClick(page, 0);
    await expect(page.locator('.modal.show .modal-title')).toContainText('付款账号配置详情');
  });
});
