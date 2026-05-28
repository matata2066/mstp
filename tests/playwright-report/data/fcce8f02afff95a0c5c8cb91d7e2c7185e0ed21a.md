# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: payment-query.spec.ts >> 支付指令查询页面 >> VALIDATING_FAILED状态显示重试按钮
- Location: specs\payment-query.spec.ts:63:7

# Error details

```
Error: expect(locator).toBeVisible() failed

Locator: locator('.modal.show .retry-btn')
Expected: visible
Timeout: 10000ms
Error: element(s) not found

Call log:
  - Expect "toBeVisible" with timeout 10000ms
  - waiting for locator('.modal.show .retry-btn')

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
- link "交易查询":
  - /url: "#"
- text: /支付指令 A admin 支付指令查询 交易ID
- textbox "请输入交易ID"
- text: 收款账号
- textbox "请输入收款账号"
- text: 渠道
- combobox:
  - option "全部" [selected]
  - option "CNAPS"
  - option "CIPS"
- text: 状态
- combobox:
  - option "全部" [selected]
  - option "GCMS"
  - option "Validating"
  - option "Sending"
  - option "CitiFT Pending"
  - option "CitiFT Succ"
  - option "LCP Pending"
  - option "LCP Cleared"
  - option "CIPS Pending"
  - option "CIPS Cleared"
  - option "Timeout"
  - option "Failed"
- button "查询"
- button "重置"
- table:
  - rowgroup:
    - row "交易ID 渠道 付款行 付款账号 付款户名 收款行 收款账号 收款户名 金额 记账日期 交易附言 状态":
      - columnheader "交易ID"
      - columnheader "渠道"
      - columnheader "付款行"
      - columnheader "付款账号"
      - columnheader "付款户名"
      - columnheader "收款行"
      - columnheader "收款账号"
      - columnheader "收款户名"
      - columnheader "金额"
      - columnheader "记账日期"
      - columnheader "交易附言"
      - columnheader "状态"
  - rowgroup:
    - row "MSTP-20260518-0001 CNAPS 工商银行北京分行 0200********3456 某某科技有限公司 建设银行北京分行 6225********6789 张* 100,000.00 2026-05-19 工资 LCP Cleared":
      - cell "MSTP-20260518-0001"
      - cell "CNAPS"
      - cell "工商银行北京分行"
      - cell "0200********3456"
      - cell "某某科技有限公司"
      - cell "建设银行北京分行"
      - cell "6225********6789"
      - cell "张*"
      - cell "100,000.00"
      - cell "2026-05-19"
      - cell "工资"
      - cell "LCP Cleared"
    - row "MSTP-20260518-0002 CIPS 兴业银行 0200********9012 某某科技有限公司 Citibank N.A. 9876********3456 J**** 50,000.00 2026-05-19 转账 CIPS Pending":
      - cell "MSTP-20260518-0002"
      - cell "CIPS"
      - cell "兴业银行"
      - cell "0200********9012"
      - cell "某某科技有限公司"
      - cell "Citibank N.A."
      - cell "9876********3456"
      - cell "J****"
      - cell "50,000.00"
      - cell "2026-05-19"
      - cell "转账"
      - cell "CIPS Pending"
    - row "MSTP-20260518-0003 CNAPS 工商银行北京分行 0200********3456 某某科技有限公司 农业银行北京分行 6228********0045 李* 80,000.00 2026-05-19 税款 LCP Pending":
      - cell "MSTP-20260518-0003"
      - cell "CNAPS"
      - cell "工商银行北京分行"
      - cell "0200********3456"
      - cell "某某科技有限公司"
      - cell "农业银行北京分行"
      - cell "6228********0045"
      - cell "李*"
      - cell "80,000.00"
      - cell "2026-05-19"
      - cell "税款"
      - cell "LCP Pending"
    - row "MSTP-20260518-0004 CNAPS 工商银行北京分行 0200********3456 某某科技有限公司 中国银行北京分行 6217********0890 孙* 250,000.00 2026-05-19 还款 LCP Cleared":
      - cell "MSTP-20260518-0004"
      - cell "CNAPS"
      - cell "工商银行北京分行"
      - cell "0200********3456"
      - cell "某某科技有限公司"
      - cell "中国银行北京分行"
      - cell "6217********0890"
      - cell "孙*"
      - cell "250,000.00"
      - cell "2026-05-19"
      - cell "还款"
      - cell "LCP Cleared"
    - row "MSTP-20260518-0005 CIPS 兴业银行 0200********9012 某某科技有限公司 Deutsche Bank AG DE89********3000 H**** 30,000.00 2026-05-19 转账 CitiFT Pending":
      - cell "MSTP-20260518-0005"
      - cell "CIPS"
      - cell "兴业银行"
      - cell "0200********9012"
      - cell "某某科技有限公司"
      - cell "Deutsche Bank AG"
      - cell "DE89********3000"
      - cell "H****"
      - cell "30,000.00"
      - cell "2026-05-19"
      - cell "转账"
      - cell "CitiFT Pending"
    - row "MSTP-20260518-0006 CNAPS 工商银行北京分行 0200********3456 某某科技有限公司 交通银行北京分行 6226********0567 赵* 15,000.00 2026-05-19 - CitiFT Pending (timeout)":
      - cell "MSTP-20260518-0006"
      - cell "CNAPS"
      - cell "工商银行北京分行"
      - cell "0200********3456"
      - cell "某某科技有限公司"
      - cell "交通银行北京分行"
      - cell "6226********0567"
      - cell "赵*"
      - cell "15,000.00"
      - cell "2026-05-19"
      - cell "-"
      - cell "CitiFT Pending (timeout)"
    - row "MSTP-20260518-0007 CNAPS 工商银行北京分行 0200********3456 某某科技有限公司 建设银行北京分行 6229********0234 周* 60,000.00 2026-05-18 工资 LCP Cleared":
      - cell "MSTP-20260518-0007"
      - cell "CNAPS"
      - cell "工商银行北京分行"
      - cell "0200********3456"
      - cell "某某科技有限公司"
      - cell "建设银行北京分行"
      - cell "6229********0234"
      - cell "周*"
      - cell "60,000.00"
      - cell "2026-05-18"
      - cell "工资"
      - cell "LCP Cleared"
    - row "MSTP-20260518-0008 CIPS 招商银行 0200********7890 某某科技有限公司 HSBC Holdings GB29********6819 D**** 75,000.00 2026-05-19 转账 CIPS Pending (timeout)":
      - cell "MSTP-20260518-0008"
      - cell "CIPS"
      - cell "招商银行"
      - cell "0200********7890"
      - cell "某某科技有限公司"
      - cell "HSBC Holdings"
      - cell "GB29********6819"
      - cell "D****"
      - cell "75,000.00"
      - cell "2026-05-19"
      - cell "转账"
      - cell "CIPS Pending (timeout)"
    - row "MSTP-20260518-0009 CNAPS 工商银行北京分行 0200********3456 某某科技有限公司 招商银行北京分行 6214********6789 吴* 35,000.00 2026-05-19 - Validating Failed":
      - cell "MSTP-20260518-0009"
      - cell "CNAPS"
      - cell "工商银行北京分行"
      - cell "0200********3456"
      - cell "某某科技有限公司"
      - cell "招商银行北京分行"
      - cell "6214********6789"
      - cell "吴*"
      - cell "35,000.00"
      - cell "2026-05-19"
      - cell "-"
      - cell "Validating Failed"
- text: 共 9 条 1 交易详情
- button "✕"
- text: 基本信息 交易ID MSTP-20260518-0009 上游消息ID MSG-20260518-000009 渠道 CNAPS 记账日期 2026-05-19 入库时间 2026-05-18 14:00:00 交易附言 - 状态 Validating Failed GCMS ▸ Validating ▸ Validating Failed ▸ Sending ▸ CitiFT Pending ▸ CitiFT Succ ▸ LCP Pending ▸ LCP Cleared 下游参考号 - 错误码 ENRICHMENT_FAIL 错误信息 收款账号映射未找到，请检查映射表配置 付款信息 付款行行号 102100099996 付款行名称 工商银行北京分行 付款账号 0200003609000123456 付款账户名 某某科技有限公司 收款信息 收款行行号 308584000013 收款行名称 招商银行北京分行 收款账号 6214830123456789 收款账户名 吴九 金额信息 金额 35,000.00 CNY 状态变更记录 14:00:00 GCMS → Validating 14:00:05 Validating → Validating Failed
- button "关闭"
- button "🔄 重试"
```

# Test source

```ts
  1   | import { test, expect, navigateTo, openDetailByDblClick, closeModal } from './helpers';
  2   | 
  3   | test.describe('支付指令查询页面', () => {
  4   |   test.beforeEach(async ({ page }) => {
  5   |     await navigateTo(page, 'paymentQuery');
  6   |   });
  7   | 
  8   |   test('页面标题显示正确', async ({ page }) => {
  9   |     await expect(page.locator('.page-title')).toHaveText('支付指令查询');
  10  |   });
  11  | 
  12  |   test('表格有数据行', async ({ page }) => {
  13  |     const count = await page.locator('tbody tr').count();
  14  |     expect(count).toBeGreaterThan(0);
  15  |   });
  16  | 
  17  |   test('表头包含交易附言列', async ({ page }) => {
  18  |     const headers = page.locator('thead th');
  19  |     const headerTexts = await headers.allTextContents();
  20  |     expect(headerTexts).toContain('交易附言');
  21  |   });
  22  | 
  23  |   test('表头包含记账日期列', async ({ page }) => {
  24  |     const headers = page.locator('thead th');
  25  |     const headerTexts = await headers.allTextContents();
  26  |     expect(headerTexts).toContain('记账日期');
  27  |   });
  28  | 
  29  |   test('双击行打开交易详情弹窗', async ({ page }) => {
  30  |     await openDetailByDblClick(page, 0);
  31  |     await expect(page.locator('.modal.show .modal-title')).toContainText('交易详情');
  32  |   });
  33  | 
  34  |   test('交易详情弹窗显示基本信息', async ({ page }) => {
  35  |     await openDetailByDblClick(page, 0);
  36  |     const body = page.locator('.modal.show .modal-body');
  37  |     await expect(body).toContainText('交易ID');
  38  |     await expect(body).toContainText('渠道');
  39  |     await expect(body).toContainText('记账日期');
  40  |     await expect(body).toContainText('入库时间');
  41  |     await expect(body).toContainText('交易附言');
  42  |   });
  43  | 
  44  |   test('交易详情弹窗显示付款信息和收款信息', async ({ page }) => {
  45  |     await openDetailByDblClick(page, 0);
  46  |     const body = page.locator('.modal.show .modal-body');
  47  |     await expect(body).toContainText('付款信息');
  48  |     await expect(body).toContainText('收款信息');
  49  |   });
  50  | 
  51  |   test('交易详情弹窗显示状态变更记录', async ({ page }) => {
  52  |     await openDetailByDblClick(page, 0);
  53  |     const body = page.locator('.modal.show .modal-body');
  54  |     await expect(body).toContainText('状态变更记录');
  55  |   });
  56  | 
  57  |   test('状态流图显示在详情中', async ({ page }) => {
  58  |     await openDetailByDblClick(page, 0);
  59  |     const statusNodes = page.locator('.modal.show .status-node');
  60  |     await expect(statusNodes.first()).toBeVisible();
  61  |   });
  62  | 
  63  |   test('VALIDATING_FAILED状态显示重试按钮', async ({ page }) => {
  64  |     const rows = page.locator('tbody tr');
  65  |     const count = await rows.count();
  66  |     let foundRetryRow = false;
  67  |     for (let i = 0; i < count; i++) {
  68  |       const text = await rows.nth(i).textContent();
  69  |       if (text?.includes('Validating Failed')) {
  70  |         foundRetryRow = true;
  71  |         await rows.nth(i).dblclick();
  72  |         break;
  73  |       }
  74  |     }
  75  |     if (foundRetryRow) {
> 76  |       await expect(page.locator('.modal.show .retry-btn')).toBeVisible();
      |                                                            ^ Error: expect(locator).toBeVisible() failed
  77  |     }
  78  |   });
  79  | 
  80  |   test('点击重试按钮弹出确认弹窗', async ({ page }) => {
  81  |     const rows = page.locator('tbody tr');
  82  |     const count = await rows.count();
  83  |     for (let i = 0; i < count; i++) {
  84  |       const text = await rows.nth(i).textContent();
  85  |       if (text?.includes('Validating Failed')) {
  86  |         await rows.nth(i).dblclick();
  87  |         break;
  88  |       }
  89  |     }
  90  |     const retryBtn = page.locator('.modal.show .retry-btn');
  91  |     if (await retryBtn.isVisible()) {
  92  |       await retryBtn.click();
  93  |       await expect(page.locator('.modal.show .modal-title:has-text("确认重试")')).toBeVisible();
  94  |     }
  95  |   });
  96  | 
  97  |   test('关闭交易详情弹窗', async ({ page }) => {
  98  |     await openDetailByDblClick(page, 0);
  99  |     await closeModal(page);
  100 |   });
  101 | 
  102 |   test('CNAPS和CIPS渠道标签都有显示', async ({ page }) => {
  103 |     const cnapsTag = page.locator('tbody .tag-blue:has-text("CNAPS")');
  104 |     const cipsTag = page.locator('tbody .tag-purple:has-text("CIPS")');
  105 |     const cnapsCount = await cnapsTag.count();
  106 |     const cipsCount = await cipsTag.count();
  107 |     expect(cnapsCount + cipsCount).toBeGreaterThan(0);
  108 |   });
  109 | 
  110 |   test('有交易附言数据的行显示附言内容', async ({ page }) => {
  111 |     const rows = page.locator('tbody tr');
  112 |     const count = await rows.count();
  113 |     let foundRemark = false;
  114 |     for (let i = 0; i < count; i++) {
  115 |       const cells = rows.nth(i).locator('td');
  116 |       const cellTexts = await cells.allTextContents();
  117 |       const remarkCell = cellTexts.find(t => ['工资', '转账', '税款', '还款'].some(k => t.includes(k)));
  118 |       if (remarkCell) {
  119 |         foundRemark = true;
  120 |         break;
  121 |       }
  122 |     }
  123 |     expect(foundRemark).toBeTruthy();
  124 |   });
  125 | });
  126 | 
```