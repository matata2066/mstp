import { test, expect } from '@playwright/test';

test.describe('审批页面弹窗测试', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('http://localhost:8080/login.html');
    await page.fill('[name="username"]', 'admin');
    await page.click('.btn-login');
    await page.waitForURL(/^(?!.*login)/, { timeout: 10000 });
    await page.waitForTimeout(500);
  });

  test('审批按钮点击后应弹出详情弹窗', async ({ page }) => {
    await page.goto('http://localhost:8080/approval-pending.html');
    await page.waitForTimeout(1500);

    const rows = page.locator('#tableBody tr');
    const rowCount = await rows.count();
    console.log(`表格行数: ${rowCount}`);

    const firstRowText = await rows.first().textContent().catch(() => '');
    if (firstRowText.includes('暂无数据')) {
      console.log('无待审批数据，跳过测试');
      return;
    }

    const approveBtn = rows.first().locator('button:has-text("审批")');
    const btnCount = await approveBtn.count();
    console.log(`审批按钮数量: ${btnCount}`);

    if (btnCount > 0) {
      await approveBtn.click();
      await page.waitForTimeout(500);

      const detailModal = page.locator('#detailModal');
      const isActive = await detailModal.evaluate(el => el.classList.contains('show'));
      console.log(`详情弹窗是否show: ${isActive}`);

      expect(isActive).toBeTruthy();
    }
  });

  test('详情弹窗中点击通过按钮应弹出确认弹窗', async ({ page }) => {
    await page.goto('http://localhost:8080/approval-pending.html');
    await page.waitForTimeout(1500);

    const rows = page.locator('#tableBody tr');
    const firstRowText = await rows.first().textContent().catch(() => '');
    if (firstRowText.includes('暂无数据')) {
      console.log('无待审批数据，跳过测试');
      return;
    }

    const approveBtn = rows.first().locator('button:has-text("审批")');
    if (await approveBtn.count() > 0) {
      await approveBtn.click();
      await page.waitForTimeout(500);

      const detailModal = page.locator('#detailModal');
      const detailActive = await detailModal.evaluate(el => el.classList.contains('show'));
      console.log(`详情弹窗show: ${detailActive}`);

      if (detailActive) {
        const passBtn = page.locator('#detailModal button:has-text("通过")');
        const passBtnHtml = await passBtn.first().evaluate(el => el.outerHTML).catch(() => 'NOT FOUND');
        console.log(`通过按钮HTML: ${passBtnHtml}`);

        const passBtnOnclick = await passBtn.first().evaluate(el => el.getAttribute('onclick')).catch(() => 'NOT FOUND');
        console.log(`通过按钮onclick: ${passBtnOnclick}`);

        await passBtn.first().click();
        await page.waitForTimeout(500);

        const approveModal = page.locator('#approveModal');
        const approveActive = await approveModal.evaluate(el => el.classList.contains('show'));
        console.log(`审批确认弹窗show: ${approveActive}`);

        const approveBodyHtml = await page.locator('#approveBody').innerHTML().catch(() => '');
        console.log(`审批确认弹窗内容(前300字符): ${approveBodyHtml.substring(0, 300)}`);

        expect(approveActive).toBeTruthy();
      }
    }
  });

  test('详情弹窗中点击拒绝按钮应弹出拒绝弹窗', async ({ page }) => {
    await page.goto('http://localhost:8080/approval-pending.html');
    await page.waitForTimeout(1500);

    const rows = page.locator('#tableBody tr');
    const firstRowText = await rows.first().textContent().catch(() => '');
    if (firstRowText.includes('暂无数据')) {
      console.log('无待审批数据，跳过测试');
      return;
    }

    const approveBtn = rows.first().locator('button:has-text("审批")');
    if (await approveBtn.count() > 0) {
      await approveBtn.click();
      await page.waitForTimeout(500);

      const detailModal = page.locator('#detailModal');
      const detailActive = await detailModal.evaluate(el => el.classList.contains('active'));

      if (detailActive) {
        const rejectBtn = page.locator('#detailModal button:has-text("拒绝")');
        const rejectBtnOnclick = await rejectBtn.first().evaluate(el => el.getAttribute('onclick')).catch(() => 'NOT FOUND');
        console.log(`拒绝按钮onclick: ${rejectBtnOnclick}`);

        await rejectBtn.first().click();
        await page.waitForTimeout(500);

        const rejectModal = page.locator('#rejectModal');
        const rejectActive = await rejectModal.evaluate(el => el.classList.contains('show'));
        console.log(`拒绝弹窗show: ${rejectActive}`);

        expect(rejectActive).toBeTruthy();
      }
    }
  });

  test('检查页面JS函数是否存在', async ({ page }) => {
    const errors: string[] = [];
    page.on('console', msg => {
      if (msg.type() === 'error') errors.push(msg.text());
    });
    page.on('pageerror', err => errors.push(err.message));

    await page.goto('http://localhost:8080/approval-pending.html');
    await page.waitForTimeout(2000);

    if (errors.length > 0) {
      console.log('页面JS错误:');
      errors.forEach(e => console.log(`  - ${e}`));
    } else {
      console.log('无JS错误');
    }

    const openApproveModalExists = await page.evaluate(() => typeof (window as any).openApproveModal === 'function');
    console.log(`openApproveModal函数是否存在: ${openApproveModalExists}`);

    const openRejectModalExists = await page.evaluate(() => typeof (window as any).openRejectModal === 'function');
    console.log(`openRejectModal函数是否存在: ${openRejectModalExists}`);

    const showDetailExists = await page.evaluate(() => typeof (window as any).showDetail === 'function');
    console.log(`showDetail函数是否存在: ${showDetailExists}`);

    const openModalExists = await page.evaluate(() => typeof (window as any).openModal === 'function');
    console.log(`openModal函数是否存在: ${openModalExists}`);

    expect(openApproveModalExists).toBeTruthy();
    expect(openRejectModalExists).toBeTruthy();
  });
});
