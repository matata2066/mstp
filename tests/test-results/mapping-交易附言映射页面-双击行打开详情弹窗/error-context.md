# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: mapping.spec.ts >> 交易附言映射页面 >> 双击行打开详情弹窗
- Location: specs\mapping.spec.ts:117:7

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
- text: /附言映射 A admin 交易附言映射
- button "+ 新增"
- text: 匹配模式
- textbox "请输入匹配模式"
- text: 状态
- combobox:
  - option "全部" [selected]
  - option "有效"
  - option "停用"
- button "查询"
- button "重置"
- table:
  - rowgroup:
    - row "序号 匹配模式 中文附言 状态 备注 操作":
      - columnheader "序号"
      - columnheader "匹配模式"
      - columnheader "中文附言"
      - columnheader "状态"
      - columnheader "备注"
      - columnheader "操作"
  - rowgroup:
    - row "1 SALARY 工资 有效 用于工资发放交易 详情 编辑":
      - cell "1"
      - cell "SALARY"
      - cell "工资"
      - cell "有效"
      - cell "用于工资发放交易"
      - cell "详情 编辑":
        - button "详情"
        - button "编辑"
    - row "2 TRANSFER 转账 有效 一般转账交易 详情 编辑":
      - cell "2"
      - cell "TRANSFER"
      - cell "转账"
      - cell "有效"
      - cell "一般转账交易"
      - cell "详情 编辑":
        - button "详情"
        - button "编辑"
    - row "3 LOAN% [前缀匹配] 贷款 停用 前缀匹配，已停用 详情 编辑":
      - cell "3"
      - cell "LOAN% [前缀匹配]"
      - cell "贷款"
      - cell "停用"
      - cell "前缀匹配，已停用"
      - cell "详情 编辑":
        - button "详情"
        - button "编辑"
    - row "4 TAX 税款 有效 税款缴纳交易 详情 编辑":
      - cell "4"
      - cell "TAX"
      - cell "税款"
      - cell "有效"
      - cell "税款缴纳交易"
      - cell "详情 编辑":
        - button "详情"
        - button "编辑"
    - row "5 REPAY% [前缀匹配] 还款 有效 前缀匹配，贷款还款 详情 编辑":
      - cell "5"
      - cell "REPAY% [前缀匹配]"
      - cell "还款"
      - cell "有效"
      - cell "前缀匹配，贷款还款"
      - cell "详情 编辑":
        - button "详情"
        - button "编辑"
- text: 共 5 条 1 交易附言映射详情
- button "✕"
- text: 匹配模式 SALARY （精确匹配） 中文附言 工资 状态 有效 备注 用于工资发放交易 审批信息 制单人 user001 制单时间 2026-05-18 10:00:00 审批人 user002 审批时间 2026-05-18 10:05:00
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