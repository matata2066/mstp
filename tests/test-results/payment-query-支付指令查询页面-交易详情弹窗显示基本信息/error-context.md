# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: payment-query.spec.ts >> 支付指令查询页面 >> 交易详情弹窗显示基本信息
- Location: specs\payment-query.spec.ts:34:7

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
- text: 基本信息 交易ID MSTP-20260518-0001 上游消息ID MSG-20260518-000001 渠道 CNAPS 记账日期 2026-05-19 入库时间 2026-05-18 10:30:00 交易附言 工资 状态 LCP Cleared GCMS ▸ Validating ▸ Sending ▸ CitiFT Pending ▸ CitiFT Succ ▸ LCP Pending ▸ LCP Cleared 下游参考号 DS-20260518-123456 付款信息 付款行行号 102100099996 付款行名称 工商银行北京分行 付款账号 0200003609000123456 付款账户名 某某科技有限公司 收款信息 收款行行号 105100000017 收款行名称 建设银行北京分行 收款账号 6225880123456789 收款账户名 张三 金额信息 金额 100,000.00 CNY 状态变更记录 10:30:00 GCMS → Validating 10:30:01 Validating → Sending 10:30:02 Sending → CitiFT Pending 10:30:15 CitiFT Pending → CitiFT Succ 10:30:16 CitiFT Succ → LCP Pending 10:32:15 LCP Pending → LCP Cleared
- button "关闭"
```

# Test source

```ts
  1  | import { test as base, expect } from '@playwright/test';
  2  | 
  3  | export const test = base;
  4  | 
  5  | export const PAGES = {
  6  |   dashboard: '/dashboard.html',
  7  |   accountMapping: '/account-mapping.html',
  8  |   bankMapping: '/bank-mapping.html',
  9  |   remarkMapping: '/remark-mapping.html',
  10 |   payerConfig: '/payer-config.html',
  11 |   approvalPending: '/approval-pending.html',
  12 |   paymentQuery: '/payment-query.html',
  13 |   maintenanceLog: '/maintenance-log.html',
  14 | };
  15 | 
  16 | export async function navigateTo(page, pageKey: string) {
  17 |   await page.goto(PAGES[pageKey]);
  18 |   await page.waitForLoadState('networkidle');
  19 | }
  20 | 
  21 | export async function openDetailByDblClick(page, rowIndex: number) {
  22 |   const rows = page.locator('tbody tr');
  23 |   await rows.nth(rowIndex).dblclick();
> 24 |   await expect(page.locator('.modal.show')).toBeVisible();
     |                                             ^ Error: expect(locator).toBeVisible() failed
  25 | }
  26 | 
  27 | export async function closeModal(page) {
  28 |   await page.locator('.modal.show .modal-close').click();
  29 |   await expect(page.locator('.modal.show')).not.toBeVisible();
  30 | }
  31 | 
  32 | export async function getTableRowCount(page) {
  33 |   return await page.locator('tbody tr').count();
  34 | }
  35 | 
  36 | export async function clickSidebarMenu(page, menuText: string) {
  37 |   await page.locator(`.menu-item:has-text("${menuText}")`).click();
  38 |   await page.waitForLoadState('networkidle');
  39 | }
  40 | 
  41 | export { expect };
  42 | 
```