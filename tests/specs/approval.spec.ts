import { test, expect, navigateTo, openDetailByDblClick, closeModal } from './helpers';

test.describe('审批查询页面', () => {
  test.beforeEach(async ({ page }) => {
    await navigateTo(page, 'approvalPending');
  });

  test('页面标题显示正确', async ({ page }) => {
    await expect(page.locator('.page-title')).toHaveText('审批查询');
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
    expect(headerTexts).toContain('制单人');
  });

  test('业务类型包含附言映射选项', async ({ page }) => {
    const options = page.locator('select option');
    const texts = await options.allTextContents();
    expect(texts).toContain('附言映射');
  });

  test('双击行打开审批详情弹窗', async ({ page }) => {
    await openDetailByDblClick(page, 0);
    await expect(page.locator('.modal.show .modal-title')).toContainText('审批详情');
  });

  test('审批详情弹窗显示变更内容', async ({ page }) => {
    await openDetailByDblClick(page, 0);
    const body = page.locator('.modal.show .modal-body');
    await expect(body).toContainText('变更内容');
  });

  test('审批详情弹窗有通过和拒绝按钮', async ({ page }) => {
    await openDetailByDblClick(page, 0);
    const footer = page.locator('.modal.show .modal-footer');
    await expect(footer.locator('button:has-text("通过")')).toBeVisible();
    await expect(footer.locator('button:has-text("拒绝")')).toBeVisible();
  });

  test('点击通过按钮弹出确认弹窗', async ({ page }) => {
    await openDetailByDblClick(page, 0);
    await page.locator('.modal.show .modal-footer button:has-text("通过")').click();
    await expect(page.locator('.modal.show .modal-title:has-text("审批确认")')).toBeVisible();
  });

  test('点击拒绝按钮弹出拒绝弹窗', async ({ page }) => {
    await openDetailByDblClick(page, 0);
    await page.locator('.modal.show .modal-footer button:has-text("拒绝")').click();
    await expect(page.locator('.modal.show .modal-title:has-text("拒绝审批")')).toBeVisible();
  });

  test('拒绝弹窗包含拒绝原因输入框', async ({ page }) => {
    await openDetailByDblClick(page, 0);
    await page.locator('.modal.show .modal-footer button:has-text("拒绝")').click();
    const rejectModal = page.locator('.modal.show .modal-title:has-text("拒绝审批")').locator('..');
    await expect(rejectModal.locator('textarea')).toBeVisible();
  });

  test('附言映射审批记录显示正确', async ({ page }) => {
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
});
