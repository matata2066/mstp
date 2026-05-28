# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: mapping.spec.ts >> 付款账号配置页面 >> 双击行打开详情弹窗
- Location: specs\mapping.spec.ts:142:7

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
- text: /付款配置 A admin 付款账号配置
- button "+ 新增"
- text: 渠道
- combobox:
  - option "全部" [selected]
  - option "CNAPS"
  - option "CIPS"
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
    - row "序号 渠道 付款行行号 付款行名称 付款账号 付款户名 支付通道 授权状态 操作":
      - columnheader "序号"
      - columnheader "渠道"
      - columnheader "付款行行号"
      - columnheader "付款行名称"
      - columnheader "付款账号"
      - columnheader "付款户名"
      - columnheader "支付通道"
      - columnheader "授权状态"
      - columnheader "操作"
  - rowgroup:
    - row "1 CNAPS 102100099996 中国工商银行北京市分行 0200********3456 某某科技有限公司 CNAPS ✅ 已授权 详情 编辑":
      - cell "1"
      - cell "CNAPS"
      - cell "102100099996"
      - cell "中国工商银行北京市分行"
      - cell "0200********3456"
      - cell "某某科技有限公司"
      - cell "CNAPS"
      - cell "✅ 已授权"
      - cell "详情 编辑":
        - button "详情"
        - button "编辑"
    - row "2 CIPS CIBKCNBJXXX 兴业银行股份有限公司 0200********9012 某某科技有限公司 CIPS ✅ 已授权 详情 编辑":
      - cell "2"
      - cell "CIPS"
      - cell "CIBKCNBJXXX"
      - cell "兴业银行股份有限公司"
      - cell "0200********9012"
      - cell "某某科技有限公司"
      - cell "CIPS"
      - cell "✅ 已授权"
      - cell "详情 编辑":
        - button "详情"
        - button "编辑"
    - row "3 CIPS CMBCCNBSXXX 招商银行股份有限公司 0200********7890 某某科技有限公司 CIPS ❌ 未授权 详情 编辑 发起授权":
      - cell "3"
      - cell "CIPS"
      - cell "CMBCCNBSXXX"
      - cell "招商银行股份有限公司"
      - cell "0200********7890"
      - cell "某某科技有限公司"
      - cell "CIPS"
      - cell "❌ 未授权"
      - cell "详情 编辑 发起授权":
        - button "详情"
        - button "编辑"
        - button "发起授权"
    - row "4 CNAPS 105100000017 中国建设银行北京市分行 0200********5678 某某科技有限公司 CNAPS ❌ 未授权 详情 编辑 发起授权":
      - cell "4"
      - cell "CNAPS"
      - cell "105100000017"
      - cell "中国建设银行北京市分行"
      - cell "0200********5678"
      - cell "某某科技有限公司"
      - cell "CNAPS"
      - cell "❌ 未授权"
      - cell "详情 编辑 发起授权":
        - button "详情"
        - button "编辑"
        - button "发起授权"
- text: 共 4 条 1 付款账号配置详情
- button "✕"
- text: 渠道 CNAPS 付款行行号 102100099996 付款行名称 中国工商银行北京市分行 付款账号 0200003609000123456 付款户名 某某科技有限公司 支付通道 CNAPS 授权状态 已授权 状态 有效
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