# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: mapping.spec.ts >> 收款账号映射页面 >> 双击行打开详情弹窗
- Location: specs\mapping.spec.ts:26:7

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
- text: 共 6 条 1 收款账号映射详情
- button "✕"
- text: 收款账号 6225880123456789 账户名称 张三 支付通道 CNAPS 账户类型 外部 状态 有效 备注 测试账号 审批信息 制单人 user001 制单时间 2026-05-18 10:00:00 审批人 user002 审批时间 2026-05-18 10:05:00
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