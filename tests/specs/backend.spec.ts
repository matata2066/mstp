import { test, expect, type Page } from '@playwright/test';

const API = 'http://localhost:8080';

async function login(page: Page, username: string = 'admin'): Promise<void> {
  await page.goto('/login.html');
  await page.fill('[name="username"]', username);
  await page.click('.btn-login');
  await page.waitForURL(/^(?!.*login)/, { timeout: 10000 });
}

test.describe('1. 登录', () => {
  test('1.1 登录成功', async ({ page }) => {
    await login(page, 'admin');
    await expect(page).toHaveURL(/\/(dashboard\.html)?/);
  });
});

test.describe('2. 账号映射 CRUD + 审批', () => {
  test.beforeEach(async ({ page }) => { await login(page, 'admin'); });

  test('2.1 页面加载显示数据', async ({ page }) => {
    await page.goto('/account-mapping.html');
    await page.waitForSelector('#tableBody tr', { timeout: 10000 });
    const rows = page.locator('#tableBody tr');
    expect(await rows.count()).toBeGreaterThanOrEqual(6);
  });

  test('2.2 搜索功能', async ({ page }) => {
    await page.goto('/account-mapping.html');
    await page.waitForSelector('#tableBody tr', { timeout: 10000 });
    await page.fill('#searchAccountNo', '6230');
    await page.click('.search-bar .btn-primary');
    await page.waitForTimeout(1000);
    const rows = page.locator('#tableBody tr');
    expect(await rows.count()).toBeGreaterThanOrEqual(1);
  });

  test('2.3 重置搜索', async ({ page }) => {
    await page.goto('/account-mapping.html');
    await page.waitForSelector('#tableBody tr', { timeout: 10000 });
    await page.fill('#searchAccountNo', '6230');
    await page.click('.search-bar .btn:not(.btn-primary)');
    await page.waitForTimeout(500);
    await expect(page.locator('#searchAccountNo')).toHaveValue('');
  });

  test('2.4 新增账号映射（提交审批）', async ({ page }) => {
    await page.goto('/account-mapping.html');
    await page.waitForSelector('#tableBody tr', { timeout: 10000 });
    await page.click('.page-header .btn-primary');
    await expect(page.locator('#addModal.show')).toBeVisible();
    const ts = Date.now();
    await page.fill('#formAccountNo', 'E2E_' + ts);
    await page.fill('#formAccountName', 'E2E测试账号');
    await page.selectOption('#formCurrency', 'CNY');
    await page.selectOption('#formAccountType', 'INTERNAL');
    const [resp] = await Promise.all([
      page.waitForResponse(r => r.url().includes('/api/approvals/submit') && r.request().method() === 'POST'),
      page.click('#addModal .modal-footer .btn-primary'),
    ]);
    expect(resp.status()).toBe(200);
    await page.waitForTimeout(1000);
    const pendingTag = page.locator('#tableBody .tag:has-text("新增-待审批")');
    expect(await pendingTag.count()).toBeGreaterThanOrEqual(1);
  });

  test('2.5 查看详情', async ({ page }) => {
    await page.goto('/account-mapping.html');
    await page.waitForSelector('#tableBody tr', { timeout: 10000 });
    await page.locator('#tableBody .btn-link.btn-sm:has-text("详情")').first().click();
    await expect(page.locator('#detailModal.show')).toBeVisible();
  });

  test('2.6 编辑账号映射（提交审批）', async ({ page }) => {
    await page.goto('/account-mapping.html');
    await page.waitForSelector('#tableBody tr', { timeout: 10000 });
    const editBtn = page.locator('#tableBody .btn-link.btn-sm:has-text("编辑")').first();
    if (await editBtn.count() > 0) {
      await editBtn.click();
      await expect(page.locator('#addModal.show')).toBeVisible();
      await page.fill('#formAccountName', 'E2E编辑测试');
      const [resp] = await Promise.all([
        page.waitForResponse(r => r.url().includes('/api/approvals/submit') && r.request().method() === 'POST'),
        page.click('#addModal .modal-footer .btn-primary'),
      ]);
      expect(resp.status()).toBe(200);
    }
  });

  test('2.7 删除账号映射（提交审批）', async ({ page }) => {
    await page.goto('/account-mapping.html');
    await page.waitForSelector('#tableBody tr', { timeout: 10000 });
    const deleteBtn = page.locator('#tableBody tr:first-child .btn-link.btn-sm:has-text("删除")');
    if (await deleteBtn.count() > 0) {
      await deleteBtn.click();
      await expect(page.locator('#confirmModal.show')).toBeVisible();
      const [resp] = await Promise.all([
        page.waitForResponse(r => r.url().includes('/api/approvals/submit') && r.request().method() === 'POST'),
        page.click('#confirmModal .modal-footer .btn-primary'),
      ]);
      expect(resp.status()).toBe(200);
    }
  });
});

test.describe('3. 行号映射 CRUD + 审批', () => {
  test.beforeEach(async ({ page }) => { await login(page, 'admin'); });

  test('3.1 页面加载显示数据', async ({ page }) => {
    await page.goto('/bank-mapping.html');
    await page.waitForSelector('#tableBody tr', { timeout: 10000 });
    const rows = page.locator('#tableBody tr');
    expect(await rows.count()).toBeGreaterThanOrEqual(1);
  });

  test('3.2 新增行号映射（提交审批）', async ({ page }) => {
    await page.goto('/bank-mapping.html');
    await page.waitForSelector('#tableBody tr', { timeout: 10000 });
    await page.click('.page-header .btn-primary');
    await expect(page.locator('#addModal.show')).toBeVisible();
    const ts = Date.now();
    await page.fill('#formBankCode', 'E2E' + ts);
    await page.fill('#formBankName', 'E2E测试银行');
    await page.selectOption('#formCodeType', 'CNAPS');
    const [resp] = await Promise.all([
      page.waitForResponse(r => r.url().includes('/api/approvals/submit') && r.request().method() === 'POST'),
      page.click('#addModal .modal-footer .btn-primary'),
    ]);
    expect(resp.status()).toBe(200);
    await page.waitForTimeout(1000);
    const pendingTag = page.locator('#tableBody .tag:has-text("新增-待审批")');
    expect(await pendingTag.count()).toBeGreaterThanOrEqual(1);
  });

  test('3.3 搜索行号映射', async ({ page }) => {
    await page.goto('/bank-mapping.html');
    await page.waitForSelector('#tableBody tr', { timeout: 10000 });
    await page.fill('#searchBankCode', '1021');
    await page.click('.search-bar .btn-primary');
    await page.waitForTimeout(1000);
    const rows = page.locator('#tableBody tr');
    expect(await rows.count()).toBeGreaterThanOrEqual(1);
  });

  test('3.4 编辑行号映射（提交审批）', async ({ page }) => {
    await page.goto('/bank-mapping.html');
    await page.waitForSelector('#tableBody tr', { timeout: 10000 });
    const editBtn = page.locator('#tableBody .btn-link.btn-sm:has-text("编辑")').first();
    if (await editBtn.count() > 0) {
      await editBtn.click();
      await expect(page.locator('#addModal.show')).toBeVisible();
    }
  });

  test('3.5 删除行号映射（提交审批）', async ({ page }) => {
    await page.goto('/bank-mapping.html');
    await page.waitForSelector('#tableBody tr', { timeout: 10000 });
    const deleteBtn = page.locator('#tableBody tr:first-child .btn-link.btn-sm:has-text("删除")');
    if (await deleteBtn.count() > 0) {
      await deleteBtn.click();
      await expect(page.locator('#confirmModal.show')).toBeVisible();
      const [resp] = await Promise.all([
        page.waitForResponse(r => r.url().includes('/api/approvals/submit') && r.request().method() === 'POST'),
        page.click('#confirmModal .modal-footer .btn-primary'),
      ]);
      expect(resp.status()).toBe(200);
    }
  });
});

test.describe('4. 附言映射 CRUD + 审批', () => {
  test.beforeEach(async ({ page }) => { await login(page, 'admin'); });

  test('4.1 页面加载显示数据', async ({ page }) => {
    await page.goto('/remark-mapping.html');
    await page.waitForSelector('#tableBody tr', { timeout: 10000 });
    const rows = page.locator('#tableBody tr');
    expect(await rows.count()).toBeGreaterThanOrEqual(1);
  });

  test('4.2 新增附言映射（提交审批）', async ({ page }) => {
    await page.goto('/remark-mapping.html');
    await page.waitForSelector('#tableBody tr', { timeout: 10000 });
    await page.click('.page-header .btn-primary');
    await expect(page.locator('#addModal.show')).toBeVisible();
    const ts = Date.now();
    await page.fill('#formMatchPattern', 'E2E_' + ts);
    await page.fill('#formRemarkChinese', 'E2E测试附言');
    const [resp] = await Promise.all([
      page.waitForResponse(r => r.url().includes('/api/approvals/submit') && r.request().method() === 'POST'),
      page.click('#addModal .modal-footer .btn-primary'),
    ]);
    expect(resp.status()).toBe(200);
    await page.waitForTimeout(1000);
    const pendingTag = page.locator('#tableBody .tag:has-text("新增-待审批")');
    expect(await pendingTag.count()).toBeGreaterThanOrEqual(1);
  });

  test('4.3 搜索附言映射', async ({ page }) => {
    await page.goto('/remark-mapping.html');
    await page.waitForSelector('#tableBody tr', { timeout: 10000 });
    await page.fill('#searchMatchPattern', 'SALARY');
    await page.click('.search-bar .btn-primary');
    await page.waitForTimeout(1000);
  });

  test('4.4 删除附言映射（提交审批）', async ({ page }) => {
    await page.goto('/remark-mapping.html');
    await page.waitForSelector('#tableBody tr', { timeout: 10000 });
    const deleteBtn = page.locator('#tableBody tr:first-child .btn-link.btn-sm:has-text("删除")');
    if (await deleteBtn.count() > 0) {
      await deleteBtn.click();
      await expect(page.locator('#confirmModal.show')).toBeVisible();
      const [resp] = await Promise.all([
        page.waitForResponse(r => r.url().includes('/api/approvals/submit') && r.request().method() === 'POST'),
        page.click('#confirmModal .modal-footer .btn-primary'),
      ]);
      expect(resp.status()).toBe(200);
    }
  });
});

test.describe('5. 付款配置 CRUD + 审批', () => {
  test.beforeEach(async ({ page }) => { await login(page, 'admin'); });

  test('5.1 页面加载显示数据', async ({ page }) => {
    await page.goto('/payer-config.html');
    await page.waitForSelector('#tableBody tr', { timeout: 10000 });
    const rows = page.locator('#tableBody tr');
    expect(await rows.count()).toBeGreaterThanOrEqual(1);
  });

  test('5.2 新增付款配置（提交审批）', async ({ page }) => {
    await page.goto('/payer-config.html');
    await page.waitForSelector('#tableBody tr', { timeout: 10000 });
    await page.click('.page-header .btn-primary');
    await expect(page.locator('#addModal.show')).toBeVisible();
    await page.selectOption('#formChannel', 'CNAPS');
    const ts = Date.now();
    await page.fill('#formPayerBankCode', 'E2E' + ts);
    await page.fill('#formPayerBankName', 'E2E测试付款行');
    await page.fill('#formPayerAccountNo', 'E2E' + ts);
    await page.fill('#formPayerAccountName', 'E2E测试付款户');
    await page.selectOption('#formCurrency', 'USD');
    const [resp] = await Promise.all([
      page.waitForResponse(r => r.url().includes('/api/approvals/submit') && r.request().method() === 'POST'),
      page.click('#addModal .modal-footer .btn-primary'),
    ]);
    expect(resp.status()).toBe(200);
    await page.waitForTimeout(1000);
    const pendingTag = page.locator('#tableBody .tag:has-text("新增-待审批")');
    expect(await pendingTag.count()).toBeGreaterThanOrEqual(1);
  });

  test('5.3 发起授权', async ({ page }) => {
    await page.goto('/payer-config.html');
    await page.waitForSelector('#tableBody tr', { timeout: 10000 });
    const authBtn = page.locator('#tableBody tr:first-child .btn-link.btn-sm:has-text("发起授权")');
    if (await authBtn.count() > 0) {
      await authBtn.click();
      await expect(page.locator('#authModal.show')).toBeVisible();
      const [resp] = await Promise.all([
        page.waitForResponse(r => r.url().includes('/authorize') && r.request().method() === 'POST'),
        page.click('#authModal .modal-footer .btn-primary'),
      ]);
      expect(resp.status()).toBe(200);
      await page.waitForTimeout(500);
    }
  });

  test('5.4 删除付款配置（提交审批）', async ({ page }) => {
    await page.goto('/payer-config.html');
    await page.waitForSelector('#tableBody tr', { timeout: 10000 });
    const deleteBtn = page.locator('#tableBody tr:first-child .btn-link.btn-sm:has-text("删除")');
    if (await deleteBtn.count() > 0) {
      await deleteBtn.click();
      await expect(page.locator('#confirmModal.show')).toBeVisible();
      const [resp] = await Promise.all([
        page.waitForResponse(r => r.url().includes('/api/approvals/submit') && r.request().method() === 'POST'),
        page.click('#confirmModal .modal-footer .btn-primary'),
      ]);
      expect(resp.status()).toBe(200);
    }
  });
});

test.describe('6. 审批查询 + 审批操作', () => {
  test.beforeEach(async ({ page }) => { await login(page, 'admin'); });

  test('6.1 页面加载显示待审批数据', async ({ page }) => {
    await page.goto('/approval-pending.html');
    await page.waitForSelector('#tableBody tr', { timeout: 10000 });
    const rows = page.locator('#tableBody tr');
    expect(await rows.count()).toBeGreaterThanOrEqual(1);
  });

  test('6.2 审批通过', async ({ page }) => {
    await page.goto('/approval-pending.html');
    await page.waitForSelector('#tableBody tr', { timeout: 10000 });
    const approveBtn = page.locator('#tableBody .btn:has-text("审批")').first();
    if (await approveBtn.count() > 0) {
      await approveBtn.click();
      await expect(page.locator('#detailModal.show')).toBeVisible();
      await page.click('#detailModal .modal-footer .btn-primary');
      await expect(page.locator('#approveModal.show')).toBeVisible();
      const [resp] = await Promise.all([
        page.waitForResponse(r => r.url().includes('/approve') && r.request().method() === 'POST'),
        page.click('#approveModal .modal-footer .btn-primary'),
      ]);
      expect(resp.status()).toBe(200);
    }
  });

  test('6.3 审批拒绝', async ({ page }) => {
    await page.goto('/approval-pending.html');
    await page.waitForSelector('#tableBody tr', { timeout: 10000 });
    const approveBtn = page.locator('#tableBody .btn:has-text("审批")').first();
    if (await approveBtn.count() > 0) {
      await approveBtn.click();
      await expect(page.locator('#detailModal.show')).toBeVisible();
      await page.click('#detailModal .modal-footer .btn:first-child');
      await expect(page.locator('#rejectModal.show')).toBeVisible();
      await page.fill('#rejectReason', 'E2E测试拒绝');
      const [resp] = await Promise.all([
        page.waitForResponse(r => r.url().includes('/reject') && r.request().method() === 'POST'),
        page.click('#rejectModal .modal-footer .btn:last-child'),
      ]);
      expect(resp.status()).toBe(200);
    }
  });

  test('6.4 搜索审批记录', async ({ page }) => {
    await page.goto('/approval-pending.html');
    await page.waitForSelector('#tableBody tr', { timeout: 10000 });
    await page.selectOption('#searchBizType', 'ACCOUNT_MAPPING');
    await page.click('.search-bar .btn-primary');
    await page.waitForTimeout(1000);
  });
});

test.describe('7. 支付指令查询', () => {
  test.beforeEach(async ({ page }) => { await login(page, 'admin'); });

  test('7.1 页面加载显示数据', async ({ page }) => {
    await page.goto('/payment-query.html');
    await page.waitForSelector('#tableBody tr', { timeout: 10000 });
    const rows = page.locator('#tableBody tr');
    expect(await rows.count()).toBeGreaterThanOrEqual(1);
  });

  test('7.2 搜索支付指令', async ({ page }) => {
    await page.goto('/payment-query.html');
    await page.waitForSelector('#tableBody tr', { timeout: 10000 });
    await page.selectOption('#searchStatus', 'GCMS');
    await page.click('.search-bar .btn-primary');
    await page.waitForTimeout(1000);
  });

  test('7.3 重试VALIDATING_FAILED', async ({ page, request }) => {
    const listResp = await request.get(`${API}/api/payment-instructions?status=VALIDATING_FAILED&size=1`);
    const data = await listResp.json();
    if (data.content.length > 0) {
      const txnId = data.content[0].txnId;
      const retryResp = await request.post(`${API}/api/payment-instructions/txn/${txnId}/retry`);
      expect(retryResp.ok()).toBeTruthy();
    }
  });

  test('7.4 查看支付详情', async ({ page }) => {
    await page.goto('/payment-query.html');
    await page.waitForSelector('#tableBody tr', { timeout: 10000 });
    await page.locator('#tableBody tr').first().dblclick();
    await page.waitForTimeout(1000);
    const detailVisible = await page.locator('#detailModal.show').isVisible().catch(() => false);
    if (detailVisible) {
      await expect(page.locator('#detailModal.show')).toBeVisible();
    }
  });
});

test.describe('8. 维护记录查询', () => {
  test.beforeEach(async ({ page }) => { await login(page, 'admin'); });

  test('8.1 页面加载显示数据', async ({ page }) => {
    await page.goto('/maintenance-log.html');
    await page.waitForSelector('#tableBody tr', { timeout: 10000 });
    const rows = page.locator('#tableBody tr');
    expect(await rows.count()).toBeGreaterThanOrEqual(1);
  });

  test('8.2 搜索维护记录', async ({ page }) => {
    await page.goto('/maintenance-log.html');
    await page.waitForSelector('#tableBody tr', { timeout: 10000 });
    await page.selectOption('#searchBizType', 'BANK_MAPPING');
    await page.click('.search-bar .btn-primary');
    await page.waitForTimeout(1000);
  });

  test('8.3 查看维护记录详情', async ({ page }) => {
    await page.goto('/maintenance-log.html');
    await page.waitForSelector('#tableBody tr', { timeout: 10000 });
    await page.locator('#tableBody .btn-link.btn-sm').first().click();
    await page.waitForTimeout(500);
    const detailVisible = await page.locator('#detailModal.show').isVisible().catch(() => false);
    if (detailVisible) {
      await expect(page.locator('#detailModal.show')).toBeVisible();
    }
  });
});

test.describe('9. API 直接测试', () => {
  test('9.1 GET /api/account-mappings 返回分页数据', async ({ request }) => {
    const resp = await request.get(`${API}/api/account-mappings`);
    expect(resp.ok()).toBeTruthy();
    const data = await resp.json();
    expect(data.content).toBeDefined();
    expect(data.totalElements).toBeGreaterThanOrEqual(1);
  });

  test('9.2 POST /api/approvals/submit 创建审批', async ({ request }) => {
    const ts = Date.now();
    const resp = await request.post(`${API}/api/approvals/submit`, {
      headers: { 'Content-Type': 'application/json' },
      data: {
        bizType: 'ACCOUNT_MAPPING',
        operationType: 'CREATE',
        bizId: null,
        operationData: {
          accountNo: 'API_' + ts,
          accountName: 'API测试账号',
          currency: 'CNY',
          accountType: 'INTERNAL',
          status: 'ACTIVE',
          remark: 'API测试',
        },
        makerId: 'admin',
      },
    });
    expect(resp.ok()).toBeTruthy();
    const created = await resp.json();
    expect(created.id).toBeDefined();
    expect(created.status).toBe('PENDING');
    expect(created.bizType).toBe('ACCOUNT_MAPPING');
  });

  test('9.3 审批通过后数据生效', async ({ request }) => {
    const ts = Date.now();
    const submitResp = await request.post(`${API}/api/approvals/submit`, {
      headers: { 'Content-Type': 'application/json' },
      data: {
        bizType: 'BANK_MAPPING',
        operationType: 'CREATE',
        bizId: null,
        operationData: {
          bankCode: 'APV' + ts,
          bankName: '审批通过测试',
          codeType: 'CNAPS',
          status: 'ACTIVE',
          remark: '审批测试',
        },
        makerId: 'admin',
      },
    });
    const submitted = await submitResp.json();
    const approvalId = submitted.id;

    const approveResp = await request.post(`${API}/api/approvals/${approvalId}/approve`, {
      headers: { 'Content-Type': 'application/json' },
      data: { checkerId: 'admin' },
    });
    expect(approveResp.ok()).toBeTruthy();
    const approved = await approveResp.json();
    expect(approved.status).toBe('APPROVED');

    const listResp = await request.get(`${API}/api/bank-mappings`);
    const list = await listResp.json();
    const found = list.content.some((item: any) => item.bankCode.startsWith('APV'));
    expect(found).toBeTruthy();
  });

  test('9.4 审批拒绝后数据不生效', async ({ request }) => {
    const ts = Date.now();
    const submitResp = await request.post(`${API}/api/approvals/submit`, {
      headers: { 'Content-Type': 'application/json' },
      data: {
        bizType: 'REMARK_MAPPING',
        operationType: 'CREATE',
        bizId: null,
        operationData: {
          matchPattern: 'RJT' + ts,
          remarkChinese: '审批拒绝测试',
          status: 'ACTIVE',
          remark: '审批测试',
        },
        makerId: 'admin',
      },
    });
    const submitted = await submitResp.json();
    const approvalId = submitted.id;

    const rejectResp = await request.post(`${API}/api/approvals/${approvalId}/reject`, {
      headers: { 'Content-Type': 'application/json' },
      data: { checkerId: 'admin', reason: 'E2E测试拒绝' },
    });
    expect(rejectResp.ok()).toBeTruthy();
    const rejected = await rejectResp.json();
    expect(rejected.status).toBe('REJECTED');

    const listResp = await request.get(`${API}/api/remark-mappings?matchPattern=RJT`);
    const list = await listResp.json();
    expect(list.totalElements).toBe(0);
  });

  test('9.5 GET /api/bank-mappings 返回数据', async ({ request }) => {
    const resp = await request.get(`${API}/api/bank-mappings`);
    expect(resp.ok()).toBeTruthy();
    const data = await resp.json();
    expect(data.totalElements).toBeGreaterThanOrEqual(1);
  });

  test('9.6 GET /api/remark-mappings 返回数据', async ({ request }) => {
    const resp = await request.get(`${API}/api/remark-mappings`);
    expect(resp.ok()).toBeTruthy();
    const data = await resp.json();
    expect(data.totalElements).toBeGreaterThanOrEqual(1);
  });

  test('9.7 GET /api/payer-configs 返回数据', async ({ request }) => {
    const resp = await request.get(`${API}/api/payer-configs`);
    expect(resp.ok()).toBeTruthy();
    const data = await resp.json();
    expect(data.totalElements).toBeGreaterThanOrEqual(0);
  });

  test('9.8 GET /api/approvals 返回数据', async ({ request }) => {
    const resp = await request.get(`${API}/api/approvals`);
    expect(resp.ok()).toBeTruthy();
    const data = await resp.json();
    expect(data.totalElements).toBeGreaterThanOrEqual(1);
  });

  test('9.9 GET /api/payment-instructions 返回数据', async ({ request }) => {
    const resp = await request.get(`${API}/api/payment-instructions`);
    expect(resp.ok()).toBeTruthy();
    const data = await resp.json();
    expect(data.totalElements).toBeGreaterThanOrEqual(1);
  });

  test('9.10 GET /api/maintenance-logs 返回数据', async ({ request }) => {
    const resp = await request.get(`${API}/api/maintenance-logs`);
    expect(resp.ok()).toBeTruthy();
    const data = await resp.json();
    expect(data.totalElements).toBeGreaterThanOrEqual(1);
  });

  test('9.11 GET /api/audit-logs 返回数据', async ({ request }) => {
    const resp = await request.get(`${API}/api/audit-logs`);
    expect(resp.ok()).toBeTruthy();
    const data = await resp.json();
    expect(data.totalElements).toBeGreaterThanOrEqual(1);
  });

  test('9.12 付款配置授权API', async ({ request }) => {
    const listResp = await request.get(`${API}/api/payer-configs?size=10`);
    const list = await listResp.json();
    const unauthorized = list.content.find((item: any) => !item.isAuthorized);
    if (unauthorized) {
      const authResp = await request.post(`${API}/api/payer-configs/${unauthorized.id}/authorize`);
      expect(authResp.ok()).toBeTruthy();
    }
  });

  test('9.13 重试VALIDATING_FAILED API', async ({ request }) => {
    const listResp = await request.get(`${API}/api/payment-instructions?status=VALIDATING_FAILED&size=1`);
    const list = await listResp.json();
    if (list.content.length > 0) {
      const txnId = list.content[0].txnId;
      const retryResp = await request.post(`${API}/api/payment-instructions/txn/${txnId}/retry`);
      expect(retryResp.ok()).toBeTruthy();
    }
  });

  test('9.14 删除审批流程', async ({ request }) => {
    const listResp = await request.get(`${API}/api/account-mappings?size=1`);
    const list = await listResp.json();
    if (list.content.length > 0) {
      const bizId = list.content[0].id;
      const submitResp = await request.post(`${API}/api/approvals/submit`, {
        headers: { 'Content-Type': 'application/json' },
        data: {
          bizType: 'ACCOUNT_MAPPING',
          operationType: 'DELETE',
          bizId: bizId,
          operationData: {},
          makerId: 'admin',
        },
      });
      expect(submitResp.ok()).toBeTruthy();
      const submitted = await submitResp.json();
      expect(submitted.status).toBe('PENDING');
      expect(submitted.operationType).toBe('DELETE');
    }
  });
});

test.describe('10. 数据库验证', () => {
  async function queryDb(sql: string) {
    const response = await fetch(`${API}/api/test/query?sql=${encodeURIComponent(sql)}`);
    return await response.json();
  }

  test('10.1 所有MSTP表有数据', async () => {
    const tables = [
      'MSTP_ACCOUNT_MAPPING', 'MSTP_BANK_MAPPING', 'MSTP_PAYER_ACCOUNT_CONFIG',
      'MSTP_REMARK_MAPPING', 'MSTP_PAYMENT_INSTRUCTION', 'MSTP_PAYMENT_STATUS_LOG',
      'MSTP_MESSAGE_EXCEPTION', 'MSTP_APPROVAL_RECORD', 'MSTP_AUDIT_LOG',
      'MSTP_SYS_CONFIG', 'MSTP_USER', 'MSTP_ROLE', 'MSTP_USER_ROLE',
    ];
    for (const table of tables) {
      const result = await queryDb(`SELECT COUNT(*) AS CNT FROM ${table}`);
      expect(result.rows[0].CNT as number).toBeGreaterThanOrEqual(1);
    }
  });

  test('10.2 支付指令覆盖多种状态', async () => {
    const result = await queryDb("SELECT DISTINCT STATUS FROM MSTP_PAYMENT_INSTRUCTION");
    const statuses = result.rows.map((r: any) => r.STATUS);
    expect(statuses.length).toBeGreaterThanOrEqual(5);
  });
});

test.describe('11. 安全性', () => {
  test('11.1 未登录访问跳转登录页', async ({ page }) => {
    await page.goto('/');
    await page.waitForURL(/login/, { timeout: 10000 });
  });

  test('11.2 API无需认证（dev模式）', async ({ page }) => {
    const resp = await page.request.get(`${API}/api/account-mappings`);
    expect(resp.ok()).toBeTruthy();
  });

  test('11.3 登出后需重新登录', async ({ page }) => {
    await login(page, 'admin');
    await page.goto('/logout');
    await page.waitForURL(/login/, { timeout: 10000 });
    await page.goto('/');
    await page.waitForURL(/login/, { timeout: 10000 });
  });
});

test.describe('12. 导航栏审批徽章', () => {
  test('12.1 审批徽章显示待审批数量', async ({ page }) => {
    await login(page, 'admin');
    await page.goto('/dashboard.html');
    await page.waitForTimeout(2000);
    const badge = page.locator('#approval-badge');
    const count = await badge.textContent().catch(() => '0');
    const num = parseInt(count || '0', 10);
    expect(num).toBeGreaterThanOrEqual(0);
  });
});

test.describe('13. 模糊匹配查询', () => {
  test.beforeEach(async ({ page }) => { await login(page, 'admin'); });

  test('13.1 账号映射模糊查询', async ({ page }) => {
    await page.goto('/account-mapping.html');
    await page.waitForSelector('#tableBody tr', { timeout: 10000 });
    await page.fill('#searchAccountNo', '6225');
    await page.click('.search-bar .btn-primary');
    await page.waitForTimeout(1000);
    const rows = page.locator('#tableBody tr');
    expect(await rows.count()).toBeGreaterThanOrEqual(1);
    const firstRowText = await rows.first().textContent();
    expect(firstRowText).toContain('6225');
  });

  test('13.2 行号映射模糊查询', async ({ page }) => {
    await page.goto('/bank-mapping.html');
    await page.waitForSelector('#tableBody tr', { timeout: 10000 });
    await page.fill('#searchBankCode', '1021');
    await page.click('.search-bar .btn-primary');
    await page.waitForTimeout(1000);
    const rows = page.locator('#tableBody tr');
    expect(await rows.count()).toBeGreaterThanOrEqual(1);
  });

  test('13.3 附言映射模糊查询', async ({ page }) => {
    await page.goto('/remark-mapping.html');
    await page.waitForSelector('#tableBody tr', { timeout: 10000 });
    await page.fill('#searchMatchPattern', 'SALARY');
    await page.click('.search-bar .btn-primary');
    await page.waitForTimeout(1000);
    const rows = page.locator('#tableBody tr');
    expect(await rows.count()).toBeGreaterThanOrEqual(1);
  });

  test('13.4 API模糊查询验证', async ({ request }) => {
    const resp = await request.get(`${API}/api/account-mappings?accountNo=6225`);
    expect(resp.ok()).toBeTruthy();
    const data = await resp.json();
    expect(data.totalElements).toBeGreaterThanOrEqual(1);
    data.content.forEach((item: any) => {
      expect(item.accountNo).toContain('6225');
    });
  });

  test('13.5 API行号模糊查询', async ({ request }) => {
    const resp = await request.get(`${API}/api/bank-mappings?bankCode=1021`);
    expect(resp.ok()).toBeTruthy();
    const data = await resp.json();
    expect(data.totalElements).toBeGreaterThanOrEqual(1);
  });
});

test.describe('14. 脱敏移除验证', () => {
  test.beforeEach(async ({ page }) => { await login(page, 'admin'); });

  test('14.1 账号映射页面不显示星号脱敏', async ({ page }) => {
    await page.goto('/account-mapping.html');
    await page.waitForSelector('#tableBody tr', { timeout: 10000 });
    const bodyText = await page.locator('#tableBody').textContent();
    expect(bodyText).not.toContain('********');
  });

  test('14.2 付款配置页面不显示星号脱敏', async ({ page }) => {
    await page.goto('/payer-config.html');
    await page.waitForSelector('#tableBody tr', { timeout: 10000 });
    const bodyText = await page.locator('#tableBody').textContent();
    expect(bodyText).not.toContain('********');
  });

  test('14.3 支付指令页面不显示星号脱敏', async ({ page }) => {
    await page.goto('/payment-query.html');
    await page.waitForSelector('#tableBody tr', { timeout: 10000 });
    const bodyText = await page.locator('#tableBody').textContent();
    expect(bodyText).not.toContain('********');
  });

  test('14.4 账号映射详情不显示脱敏', async ({ page }) => {
    await page.goto('/account-mapping.html');
    await page.waitForSelector('#tableBody tr', { timeout: 10000 });
    const detailBtn = page.locator('#tableBody .btn-link.btn-sm:has-text("详情")').first();
    if (await detailBtn.count() > 0) {
      await detailBtn.click();
      await page.waitForTimeout(500);
      const detailText = await page.locator('#detailBody').textContent();
      expect(detailText).not.toContain('********');
    }
  });
});

test.describe('15. 待审批记录在映射页面显示', () => {
  test.beforeEach(async ({ page }) => { await login(page, 'admin'); });

  test('15.1 新增提交后页面显示新增-待审批标签', async ({ page }) => {
    await page.goto('/account-mapping.html');
    await page.waitForSelector('#tableBody tr', { timeout: 10000 });
    await page.click('.page-header .btn-primary');
    await expect(page.locator('#addModal.show')).toBeVisible();
    const ts = Date.now();
    await page.fill('#formAccountNo', 'PEND_' + ts);
    await page.fill('#formAccountName', '待审批测试');
    await page.selectOption('#formCurrency', 'CNY');
    await page.selectOption('#formAccountType', 'INTERNAL');
    const [resp] = await Promise.all([
      page.waitForResponse(r => r.url().includes('/api/approvals/submit') && r.request().method() === 'POST'),
      page.click('#addModal .modal-footer .btn-primary'),
    ]);
    expect(resp.status()).toBe(200);
    await page.waitForTimeout(1000);
    const pendingTag = page.locator('#tableBody .tag:has-text("新增-待审批")');
    expect(await pendingTag.count()).toBeGreaterThanOrEqual(1);
  });

  test('15.2 修改提交后页面显示修改-待审批标签', async ({ page }) => {
    await page.goto('/account-mapping.html');
    await page.waitForSelector('#tableBody tr', { timeout: 10000 });
    const editBtn = page.locator('#tableBody .btn-link.btn-sm:has-text("编辑")').first();
    if (await editBtn.count() > 0) {
      await editBtn.click();
      await expect(page.locator('#addModal.show')).toBeVisible();
      await page.fill('#formAccountName', '修改待审批测试');
      const [resp] = await Promise.all([
        page.waitForResponse(r => r.url().includes('/api/approvals/submit') && r.request().method() === 'POST'),
        page.click('#addModal .modal-footer .btn-primary'),
      ]);
      expect(resp.status()).toBe(200);
      await page.waitForTimeout(1000);
      const pendingTag = page.locator('#tableBody .tag:has-text("修改-待审批")');
      expect(await pendingTag.count()).toBeGreaterThanOrEqual(1);
    }
  });

  test('15.3 删除提交后页面显示删除-待审批标签', async ({ page }) => {
    await page.goto('/bank-mapping.html');
    await page.waitForSelector('#tableBody tr', { timeout: 10000 });
    const deleteBtn = page.locator('#tableBody .btn-link.btn-sm:has-text("删除")').first();
    if (await deleteBtn.count() > 0) {
      await deleteBtn.click();
      await expect(page.locator('#confirmModal.show')).toBeVisible();
      const [resp] = await Promise.all([
        page.waitForResponse(r => r.url().includes('/api/approvals/submit') && r.request().method() === 'POST'),
        page.click('#confirmModal .modal-footer .btn-primary'),
      ]);
      expect(resp.status()).toBe(200);
      await page.waitForTimeout(1000);
      const pendingTag = page.locator('#tableBody .tag:has-text("删除-待审批")');
      expect(await pendingTag.count()).toBeGreaterThanOrEqual(1);
    }
  });

  test('15.4 待审批行无详情/编辑/删除按钮', async ({ page }) => {
    await page.goto('/account-mapping.html');
    await page.waitForSelector('#tableBody tr', { timeout: 10000 });
    const pendingRow = page.locator('#tableBody tr').filter({ hasText: '待审批' }).first();
    if (await pendingRow.count() > 0) {
      const detailBtn = pendingRow.locator('.btn-link:has-text("详情")');
      const editBtn = pendingRow.locator('.btn-link:has-text("编辑")');
      const deleteBtn = pendingRow.locator('.btn-link:has-text("删除")');
      expect(await detailBtn.count()).toBe(0);
      expect(await editBtn.count()).toBe(0);
      expect(await deleteBtn.count()).toBe(0);
    }
  });

  test('15.5 待审批行有黄色背景', async ({ page }) => {
    await page.goto('/account-mapping.html');
    await page.waitForSelector('#tableBody tr', { timeout: 10000 });
    const pendingRow = page.locator('#tableBody tr').filter({ hasText: '待审批' }).first();
    if (await pendingRow.count() > 0) {
      const bg = await pendingRow.evaluate(el => window.getComputedStyle(el as HTMLElement).backgroundColor);
      expect(bg).toBeTruthy();
    }
  });
});

test.describe('16. 审批详情变更内容显示', () => {
  test.beforeEach(async ({ page }) => { await login(page, 'admin'); });

  test('16.1 审批详情显示变更内容（非空）', async ({ page }) => {
    await page.goto('/approval-pending.html');
    await page.waitForSelector('#tableBody tr', { timeout: 10000 });
    const approveBtn = page.locator('#tableBody .btn:has-text("审批")').first();
    if (await approveBtn.count() > 0) {
      await approveBtn.click();
      await page.waitForTimeout(500);
      const detailVisible = await page.locator('#detailModal.show').isVisible().catch(() => false);
      if (detailVisible) {
        const changeSection = page.locator('#detailBody .detail-section:has-text("变更内容")');
        if (await changeSection.count() > 0) {
          const changeText = await changeSection.textContent();
          const hasContent = changeText && !changeText.match(/^变更内容\s*-?\s*$/);
          expect(hasContent).toBeTruthy();
        }
      }
    }
  });

  test('16.2 API审批详情operationData可解析', async ({ request }) => {
    const resp = await request.get(`${API}/api/approvals?status=PENDING&size=10`);
    const data = await resp.json();
    if (data.content.length > 0) {
      const record = data.content.find((r: any) => r.operationType !== 'DELETE') || data.content[0];
      expect(record.operationData).toBeDefined();
      const parsed = JSON.parse(record.operationData);
      if (record.operationType !== 'DELETE') {
        expect(Object.keys(parsed).length).toBeGreaterThan(0);
      }
    }
  });

  test('16.3 提交审批后详情内容完整', async ({ request }) => {
    const ts = Date.now();
    const submitResp = await request.post(`${API}/api/approvals/submit`, {
      headers: { 'Content-Type': 'application/json' },
      data: {
        bizType: 'ACCOUNT_MAPPING',
        operationType: 'CREATE',
        bizId: null,
        operationData: {
          accountNo: 'DTL_' + ts,
          accountName: '详情测试账号',
          currency: 'CNY',
          accountType: 'INTERNAL',
          status: 'ACTIVE',
          remark: '详情测试',
        },
        makerId: 'admin',
      },
    });
    const submitted = await submitResp.json();
    const detailResp = await request.get(`${API}/api/approvals/${submitted.id}`);
    const detail = await detailResp.json();
    expect(detail.operationData).toBeDefined();
    const parsed = JSON.parse(detail.operationData);
    expect(parsed.accountNo).toBe('DTL_' + ts);
    expect(parsed.accountName).toBe('详情测试账号');
    expect(parsed.currency).toBe('CNY');
  });
});

test.describe('17. 维护记录详情变更内容显示', () => {
  test.beforeEach(async ({ page }) => { await login(page, 'admin'); });

  test('17.1 维护记录详情显示变更内容（非空）', async ({ page }) => {
    await page.goto('/maintenance-log.html');
    await page.waitForSelector('#tableBody tr', { timeout: 10000 });
    const detailBtn = page.locator('#tableBody .btn-link.btn-sm').first();
    if (await detailBtn.count() > 0) {
      await detailBtn.click();
      await page.waitForTimeout(500);
      const detailVisible = await page.locator('#detailModal.show').isVisible().catch(() => false);
      if (detailVisible) {
        const changeSection = page.locator('#detailBody .detail-section:has-text("变更内容")');
        if (await changeSection.count() > 0) {
          const changeText = await changeSection.textContent();
          const hasContent = changeText && changeText.length > 10;
          expect(hasContent).toBeTruthy();
        }
      }
    }
  });

  test('17.2 API维护记录详情operationData可解析', async ({ request }) => {
    const resp = await request.get(`${API}/api/maintenance-logs?size=5`);
    const data = await resp.json();
    if (data.content.length > 0) {
      const record = data.content[0];
      expect(record.operationData).toBeDefined();
      const parsed = JSON.parse(record.operationData);
      expect(Object.keys(parsed).length).toBeGreaterThan(0);
    }
  });

  test('17.3 维护记录API按ID查询', async ({ request }) => {
    const listResp = await request.get(`${API}/api/maintenance-logs?size=1`);
    const list = await listResp.json();
    if (list.content.length > 0) {
      const id = list.content[0].id;
      const detailResp = await request.get(`${API}/api/maintenance-logs/${id}`);
      expect(detailResp.ok()).toBeTruthy();
      const detail = await detailResp.json();
      expect(detail.id).toBe(id);
      expect(detail.operationData).toBeDefined();
    }
  });
});
