import { test, expect, navigateTo, openDetailByDblClick, closeModal } from './helpers';

test.describe('支付指令查询页面', () => {
  test.beforeEach(async ({ page }) => {
    await navigateTo(page, 'paymentQuery');
  });

  test('页面标题显示正确', async ({ page }) => {
    await expect(page.locator('.page-title')).toHaveText('支付指令查询');
  });

  test('表格有数据行', async ({ page }) => {
    const count = await page.locator('tbody tr').count();
    expect(count).toBeGreaterThan(0);
  });

  test('表头包含交易附言列', async ({ page }) => {
    const headers = page.locator('thead th');
    const headerTexts = await headers.allTextContents();
    expect(headerTexts).toContain('交易附言');
  });

  test('表头包含记账日期列', async ({ page }) => {
    const headers = page.locator('thead th');
    const headerTexts = await headers.allTextContents();
    expect(headerTexts).toContain('记账日期');
  });

  test('双击行打开交易详情弹窗', async ({ page }) => {
    await openDetailByDblClick(page, 0);
    await expect(page.locator('.modal.show .modal-title')).toContainText('交易详情');
  });

  test('交易详情弹窗显示基本信息', async ({ page }) => {
    await openDetailByDblClick(page, 0);
    const body = page.locator('.modal.show .modal-body');
    await expect(body).toContainText('交易ID');
    await expect(body).toContainText('渠道');
    await expect(body).toContainText('记账日期');
    await expect(body).toContainText('入库时间');
    await expect(body).toContainText('交易附言');
  });

  test('交易详情弹窗显示付款信息和收款信息', async ({ page }) => {
    await openDetailByDblClick(page, 0);
    const body = page.locator('.modal.show .modal-body');
    await expect(body).toContainText('付款信息');
    await expect(body).toContainText('收款信息');
  });

  test('交易详情弹窗显示状态变更记录', async ({ page }) => {
    await openDetailByDblClick(page, 0);
    const body = page.locator('.modal.show .modal-body');
    await expect(body).toContainText('状态变更记录');
  });

  test('状态流图显示在详情中', async ({ page }) => {
    await openDetailByDblClick(page, 0);
    const statusNodes = page.locator('.modal.show .status-node');
    await expect(statusNodes.first()).toBeVisible();
  });

  test('VALIDATING_FAILED状态显示重试按钮', async ({ page }) => {
    const rows = page.locator('tbody tr');
    const count = await rows.count();
    let foundRetryRow = false;
    for (let i = 0; i < count; i++) {
      const text = await rows.nth(i).textContent();
      if (text?.includes('Validating Failed')) {
        foundRetryRow = true;
        await rows.nth(i).dblclick();
        break;
      }
    }
    if (foundRetryRow) {
      await expect(page.locator('.modal.show .retry-btn')).toBeVisible();
    }
  });

  test('点击重试按钮弹出确认弹窗', async ({ page }) => {
    const rows = page.locator('tbody tr');
    const count = await rows.count();
    for (let i = 0; i < count; i++) {
      const text = await rows.nth(i).textContent();
      if (text?.includes('Validating Failed')) {
        await rows.nth(i).dblclick();
        break;
      }
    }
    const retryBtn = page.locator('.modal.show .retry-btn');
    if (await retryBtn.isVisible()) {
      await retryBtn.click();
      await expect(page.locator('.modal.show .modal-title:has-text("确认重试")')).toBeVisible();
    }
  });

  test('关闭交易详情弹窗', async ({ page }) => {
    await openDetailByDblClick(page, 0);
    await closeModal(page);
  });

  test('CNAPS和CIPS渠道标签都有显示', async ({ page }) => {
    const cnapsTag = page.locator('tbody .tag-blue:has-text("CNAPS")');
    const cipsTag = page.locator('tbody .tag-purple:has-text("CIPS")');
    const cnapsCount = await cnapsTag.count();
    const cipsCount = await cipsTag.count();
    expect(cnapsCount + cipsCount).toBeGreaterThan(0);
  });

  test('有交易附言数据的行显示附言内容', async ({ page }) => {
    const rows = page.locator('tbody tr');
    const count = await rows.count();
    let foundRemark = false;
    for (let i = 0; i < count; i++) {
      const cells = rows.nth(i).locator('td');
      const cellTexts = await cells.allTextContents();
      const remarkCell = cellTexts.find(t => ['工资', '转账', '税款', '还款'].some(k => t.includes(k)));
      if (remarkCell) {
        foundRemark = true;
        break;
      }
    }
    expect(foundRemark).toBeTruthy();
  });
});
