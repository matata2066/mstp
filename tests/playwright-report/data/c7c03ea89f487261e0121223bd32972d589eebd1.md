# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: navigation.spec.ts >> 弹窗交互 >> 点击遮罩层关闭弹窗
- Location: specs\navigation.spec.ts:54:7

# Error details

```
Error: expect(locator).toBeVisible() failed

Locator: locator('.modal.show')
Expected: visible
Timeout: 10000ms
Error: element(s) not found

Call log:
  - Expect "toBeVisible" with timeout 10000ms
  - waiting for locator('.modal.show')

```

```yaml
- text: M MSTP 支付中间平台 工作台
- link "📊 总览":
  - /url: dashboard.html
- text: 映射管理
- link "🏦 账号映射":
  - /url: account-mapping.html
- link "🏢 行号映射":
  - /url: bank-mapping.html
- link "💬 附言映射":
  - /url: remark-mapping.html
- link "💳 付款配置":
  - /url: payer-config.html
- link "📋 审批查询 3":
  - /url: approval-pending.html
- text: 交易查询
- link "🔍 支付指令":
  - /url: payment-query.html
- link "📝 维护记录":
  - /url: maintenance-log.html
- link "映射管理":
  - /url: "#"
- text: /账号映射 A admin 收款账号映射
- button "+ 新增"
- text: 收款账号
- textbox "请输入收款账号"
- text: 支付通道
- combobox:
  - option "全部" [selected]
  - option "CNAPS"
  - option "CIPS"
- text: 状态
- combobox:
  - option "全部" [selected]
  - option "有效"
  - option "停用"
- button "查询"
- button "重置"
- table:
  - rowgroup:
    - row "序号 收款账号 账户名称 支付通道 账户类型 状态 操作":
      - columnheader "序号"
      - columnheader "收款账号"
      - columnheader "账户名称"
      - columnheader "支付通道"
      - columnheader "账户类型"
      - columnheader "状态"
      - columnheader "操作"
  - rowgroup:
    - row "1 6225********6789 张* CNAPS 外部 有效 详情 编辑":
      - cell "1"
      - cell "6225********6789"
      - cell "张*"
      - cell "CNAPS"
      - cell "外部"
      - cell "有效"
      - cell "详情 编辑":
        - button "详情"
        - button "编辑"
    - row "2 6228********0045 李* CIPS 外部 有效 详情 编辑":
      - cell "2"
      - cell "6228********0045"
      - cell "李*"
      - cell "CIPS"
      - cell "外部"
      - cell "有效"
      - cell "详情 编辑":
        - button "详情"
        - button "编辑"
    - row "3 6221********0123 王* CNAPS 内部 停用 详情 编辑":
      - cell "3"
      - cell "6221********0123"
      - cell "王*"
      - cell "CNAPS"
      - cell "内部"
      - cell "停用"
      - cell "详情 编辑":
        - button "详情"
        - button "编辑"
    - row "4 6226********0567 赵* CIPS 外部 有效 详情 编辑":
      - cell "4"
      - cell "6226********0567"
      - cell "赵*"
      - cell "CIPS"
      - cell "外部"
      - cell "有效"
      - cell "详情 编辑":
        - button "详情"
        - button "编辑"
    - row "5 6217********0890 孙* CNAPS 内部 有效 详情 编辑":
      - cell "5"
      - cell "6217********0890"
      - cell "孙*"
      - cell "CNAPS"
      - cell "内部"
      - cell "有效"
      - cell "详情 编辑":
        - button "详情"
        - button "编辑"
    - row "6 6229********0234 周* CIPS 外部 有效 详情 编辑":
      - cell "6"
      - cell "6229********0234"
      - cell "周*"
      - cell "CIPS"
      - cell "外部"
      - cell "有效"
      - cell "详情 编辑":
        - button "详情"
        - button "编辑"
- text: 共 6 条 1 新增收款账号映射
- button "✕"
- text: 收款账号*
- textbox "请输入收款账号"
- text: 账户名称*
- textbox "请输入账户名称"
- text: 支付通道*
- combobox:
  - option "请选择" [selected]
  - option "CNAPS"
  - option "CIPS"
- text: 账户类型*
- combobox:
  - option "请选择" [selected]
  - option "内部"
  - option "外部"
- text: 备注
- textbox "请输入备注"
- button "取消"
- button "提交审批"
```

# Test source

```ts
  1  | import { test, expect, navigateTo } from './helpers';
  2  | 
  3  | test.describe('页面导航', () => {
  4  |   test('从总览跳转到支付指令', async ({ page }) => {
  5  |     await navigateTo(page, 'dashboard');
  6  |     await page.locator('.menu-item:has-text("支付指令")').click();
  7  |     await page.waitForLoadState('networkidle');
  8  |     await expect(page).toHaveURL(/payment-query\.html/);
  9  |     await expect(page.locator('.page-title')).toHaveText('支付指令查询');
  10 |   });
  11 | 
  12 |   test('从总览跳转到账号映射', async ({ page }) => {
  13 |     await navigateTo(page, 'dashboard');
  14 |     await page.locator('.menu-item:has-text("账号映射")').click();
  15 |     await page.waitForLoadState('networkidle');
  16 |     await expect(page).toHaveURL(/account-mapping\.html/);
  17 |     await expect(page.locator('.page-title')).toHaveText('收款账号映射');
  18 |   });
  19 | 
  20 |   test('从总览跳转到附言映射', async ({ page }) => {
  21 |     await navigateTo(page, 'dashboard');
  22 |     await page.locator('.menu-item:has-text("附言映射")').click();
  23 |     await page.waitForLoadState('networkidle');
  24 |     await expect(page).toHaveURL(/remark-mapping\.html/);
  25 |     await expect(page.locator('.page-title')).toHaveText('交易附言映射');
  26 |   });
  27 | 
  28 |   test('从总览跳转到审批查询', async ({ page }) => {
  29 |     await navigateTo(page, 'dashboard');
  30 |     await page.locator('.menu-item:has-text("审批查询")').click();
  31 |     await page.waitForLoadState('networkidle');
  32 |     await expect(page).toHaveURL(/approval-pending\.html/);
  33 |     await expect(page.locator('.page-title')).toHaveText('审批查询');
  34 |   });
  35 | 
  36 |   test('从总览跳转到维护记录', async ({ page }) => {
  37 |     await navigateTo(page, 'dashboard');
  38 |     await page.locator('.menu-item:has-text("维护记录")').click();
  39 |     await page.waitForLoadState('networkidle');
  40 |     await expect(page).toHaveURL(/maintenance-log\.html/);
  41 |     await expect(page.locator('.page-title')).toHaveText('维护记录查询');
  42 |   });
  43 | });
  44 | 
  45 | test.describe('弹窗交互', () => {
  46 |   test('ESC键关闭弹窗', async ({ page }) => {
  47 |     await navigateTo(page, 'accountMapping');
  48 |     await page.locator('button:has-text("新增")').click();
  49 |     await expect(page.locator('.modal.show')).toBeVisible();
  50 |     await page.keyboard.press('Escape');
  51 |     await expect(page.locator('.modal.show')).not.toBeVisible();
  52 |   });
  53 | 
  54 |   test('点击遮罩层关闭弹窗', async ({ page }) => {
  55 |     await navigateTo(page, 'accountMapping');
  56 |     await page.locator('button:has-text("新增")').click();
> 57 |     await expect(page.locator('.modal.show')).toBeVisible();
     |                                               ^ Error: expect(locator).toBeVisible() failed
  58 |     await page.locator('.modal.show').evaluate(el => {
  59 |       el.classList.remove('show');
  60 |     });
  61 |   });
  62 | });
  63 | 
  64 | test.describe('数据脱敏', () => {
  65 |   test('收款账号映射页面账号脱敏显示', async ({ page }) => {
  66 |     await navigateTo(page, 'accountMapping');
  67 |     const firstAccountCell = page.locator('tbody tr:first-child td').nth(1);
  68 |     const text = await firstAccountCell.textContent();
  69 |     expect(text).toContain('****');
  70 |   });
  71 | 
  72 |   test('支付指令页面账号脱敏显示', async ({ page }) => {
  73 |     await navigateTo(page, 'paymentQuery');
  74 |     const firstPayerAccountCell = page.locator('tbody tr:first-child td').nth(3);
  75 |     const text = await firstPayerAccountCell.textContent();
  76 |     expect(text).toContain('****');
  77 |   });
  78 | });
  79 | 
```