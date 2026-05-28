import { test, expect, navigateTo, openDetailByDblClick, closeModal } from './helpers';

test.describe('维护记录查询页面', () => {
  test.beforeEach(async ({ page }) => {
    await navigateTo(page, 'maintenanceLog');
  });

  test('页面标题显示正确', async ({ page }) => {
    await expect(page.locator('.page-title')).toHaveText('维护记录查询');
  });

  test('表格有数据行', async ({ page }) => {
    const count = await page.locator('tbody tr').count();
    expect(count).toBeGreaterThan(0);
  });

  test('表头包含审批相关列', async ({ page }) => {
    const headers = page.locator('thead th');
    const headerTexts = await headers.allTextContents();
    expect(headerTexts).toContain('审批单号');
    expect(headerTexts).toContain('业务类型');
    expect(headerTexts).toContain('审批状态');
  });

  test('业务类型筛选包含附言映射', async ({ page }) => {
    const options = page.locator('select option');
    const texts = await options.allTextContents();
    expect(texts).toContain('附言映射');
  });

  test('审批状态筛选有全部/待审批/通过/拒绝', async ({ page }) => {
    const selects = page.locator('select');
    const statusSelect = selects.nth(1);
    const options = statusSelect.locator('option');
    const texts = await options.allTextContents();
    expect(texts).toContain('全部');
    expect(texts).toContain('待审批');
    expect(texts).toContain('通过');
    expect(texts).toContain('拒绝');
  });

  test('双击行打开维护记录详情弹窗', async ({ page }) => {
    await openDetailByDblClick(page, 0);
    await expect(page.locator('.modal-overlay.show .modal-title')).toContainText('维护记录详情');
  });

  test('详情弹窗显示变更内容', async ({ page }) => {
    await openDetailByDblClick(page, 0);
    const body = page.locator('.modal-overlay.show .modal-body');
    await expect(body).toContainText('变更内容');
  });

  test('拒绝的记录显示拒绝原因', async ({ page }) => {
    const rows = page.locator('tbody tr');
    const count = await rows.count();
    let found = false;
    for (let i = 0; i < count; i++) {
      const text = await rows.nth(i).textContent();
      if (text?.includes('拒绝')) {
        await rows.nth(i).dblclick();
        const body = page.locator('.modal-overlay.show .modal-body');
        await expect(body).toContainText('拒绝原因');
        found = true;
        break;
      }
    }
    expect(found).toBeTruthy();
  });

  test('附言映射维护记录存在', async ({ page }) => {
    const rows = page.locator('tbody tr');
    const count = await rows.count();
    let found = false;
    for (let i = 0; i < count; i++) {
      const text = await rows.nth(i).textContent();
      if (text?.includes('附言映射')) {
        found = true;
        break;
      }
    }
    expect(found).toBeTruthy();
  });

  test('点击详情按钮打开弹窗', async ({ page }) => {
    await page.locator('tbody tr:first-child .btn-link:has-text("详情")').click();
    await expect(page.locator('.modal-overlay.show')).toBeVisible();
  });
});
