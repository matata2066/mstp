# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: mapping.spec.ts >> 收款账号映射页面 >> 新增弹窗包含必填字段
- Location: specs\mapping.spec.ts:48:7

# Error details

```
Error: expect(locator).toContainText(expected) failed

Locator: locator('.modal.show')
Expected substring: "收款账号"
Timeout: 10000ms
Error: element(s) not found

Call log:
  - Expect "toContainText" with timeout 10000ms
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
  1   | import { test, expect, navigateTo, openDetailByDblClick, closeModal, getTableRowCount } from './helpers';
  2   | 
  3   | test.describe('收款账号映射页面', () => {
  4   |   test.beforeEach(async ({ page }) => {
  5   |     await navigateTo(page, 'accountMapping');
  6   |   });
  7   | 
  8   |   test('页面标题显示正确', async ({ page }) => {
  9   |     await expect(page.locator('.page-title')).toHaveText('收款账号映射');
  10  |   });
  11  | 
  12  |   test('表格有数据行', async ({ page }) => {
  13  |     const count = await getTableRowCount(page);
  14  |     expect(count).toBeGreaterThan(0);
  15  |   });
  16  | 
  17  |   test('表头包含所有列', async ({ page }) => {
  18  |     const headers = page.locator('thead th');
  19  |     const headerTexts = await headers.allTextContents();
  20  |     expect(headerTexts).toContain('收款账号');
  21  |     expect(headerTexts).toContain('账户名称');
  22  |     expect(headerTexts).toContain('支付通道');
  23  |     expect(headerTexts).toContain('状态');
  24  |   });
  25  | 
  26  |   test('双击行打开详情弹窗', async ({ page }) => {
  27  |     await openDetailByDblClick(page, 0);
  28  |     await expect(page.locator('.modal.show .modal-title')).toContainText('收款账号映射详情');
  29  |   });
  30  | 
  31  |   test('详情弹窗显示审批信息', async ({ page }) => {
  32  |     await openDetailByDblClick(page, 0);
  33  |     const body = page.locator('.modal.show .modal-body');
  34  |     await expect(body).toContainText('制单人');
  35  |     await expect(body).toContainText('审批人');
  36  |   });
  37  | 
  38  |   test('关闭详情弹窗', async ({ page }) => {
  39  |     await openDetailByDblClick(page, 0);
  40  |     await closeModal(page);
  41  |   });
  42  | 
  43  |   test('点击新增按钮打开新增弹窗', async ({ page }) => {
  44  |     await page.locator('button:has-text("新增")').click();
  45  |     await expect(page.locator('.modal.show .modal-title')).toContainText('新增收款账号映射');
  46  |   });
  47  | 
  48  |   test('新增弹窗包含必填字段', async ({ page }) => {
  49  |     await page.locator('button:has-text("新增")').click();
  50  |     const modal = page.locator('.modal.show');
> 51  |     await expect(modal).toContainText('收款账号');
      |                         ^ Error: expect(locator).toContainText(expected) failed
  52  |     await expect(modal).toContainText('账户名称');
  53  |     await expect(modal).toContainText('支付通道');
  54  |   });
  55  | 
  56  |   test('点击详情按钮打开弹窗', async ({ page }) => {
  57  |     await page.locator('tbody tr:first-child .btn-link:has-text("详情")').click();
  58  |     await expect(page.locator('.modal.show')).toBeVisible();
  59  |   });
  60  | });
  61  | 
  62  | test.describe('行号映射页面', () => {
  63  |   test.beforeEach(async ({ page }) => {
  64  |     await navigateTo(page, 'bankMapping');
  65  |   });
  66  | 
  67  |   test('页面标题显示正确', async ({ page }) => {
  68  |     await expect(page.locator('.page-title')).toHaveText('行号映射');
  69  |   });
  70  | 
  71  |   test('表格有数据行', async ({ page }) => {
  72  |     const count = await getTableRowCount(page);
  73  |     expect(count).toBeGreaterThan(0);
  74  |   });
  75  | 
  76  |   test('双击行打开详情弹窗', async ({ page }) => {
  77  |     await openDetailByDblClick(page, 0);
  78  |     await expect(page.locator('.modal.show .modal-title')).toContainText('行号映射详情');
  79  |   });
  80  | });
  81  | 
  82  | test.describe('交易附言映射页面', () => {
  83  |   test.beforeEach(async ({ page }) => {
  84  |     await navigateTo(page, 'remarkMapping');
  85  |   });
  86  | 
  87  |   test('页面标题显示正确', async ({ page }) => {
  88  |     await expect(page.locator('.page-title')).toHaveText('交易附言映射');
  89  |   });
  90  | 
  91  |   test('表格有数据行', async ({ page }) => {
  92  |     const count = await getTableRowCount(page);
  93  |     expect(count).toBeGreaterThan(0);
  94  |   });
  95  | 
  96  |   test('表头包含匹配模式和中文附言列', async ({ page }) => {
  97  |     const headers = page.locator('thead th');
  98  |     const headerTexts = await headers.allTextContents();
  99  |     expect(headerTexts).toContain('匹配模式');
  100 |     expect(headerTexts).toContain('中文附言');
  101 |   });
  102 | 
  103 |   test('前缀匹配模式有标记', async ({ page }) => {
  104 |     const prefixRows = page.locator('tbody tr');
  105 |     const count = await prefixRows.count();
  106 |     let foundPrefix = false;
  107 |     for (let i = 0; i < count; i++) {
  108 |       const text = await prefixRows.nth(i).textContent();
  109 |       if (text?.includes('前缀匹配')) {
  110 |         foundPrefix = true;
  111 |         break;
  112 |       }
  113 |     }
  114 |     expect(foundPrefix).toBeTruthy();
  115 |   });
  116 | 
  117 |   test('双击行打开详情弹窗', async ({ page }) => {
  118 |     await openDetailByDblClick(page, 0);
  119 |     await expect(page.locator('.modal.show .modal-title')).toContainText('交易附言映射详情');
  120 |   });
  121 | 
  122 |   test('点击新增按钮打开新增弹窗', async ({ page }) => {
  123 |     await page.locator('button:has-text("新增")').click();
  124 |     await expect(page.locator('.modal.show .modal-title')).toContainText('新增交易附言映射');
  125 |   });
  126 | });
  127 | 
  128 | test.describe('付款账号配置页面', () => {
  129 |   test.beforeEach(async ({ page }) => {
  130 |     await navigateTo(page, 'payerConfig');
  131 |   });
  132 | 
  133 |   test('页面标题显示正确', async ({ page }) => {
  134 |     await expect(page.locator('.page-title')).toHaveText('付款账号配置');
  135 |   });
  136 | 
  137 |   test('表格有数据行', async ({ page }) => {
  138 |     const count = await getTableRowCount(page);
  139 |     expect(count).toBeGreaterThan(0);
  140 |   });
  141 | 
  142 |   test('双击行打开详情弹窗', async ({ page }) => {
  143 |     await openDetailByDblClick(page, 0);
  144 |     await expect(page.locator('.modal.show .modal-title')).toContainText('付款账号配置详情');
  145 |   });
  146 | });
  147 | 
```