# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: approval.spec.ts >> 审批查询页面 >> 审批详情弹窗显示变更内容
- Location: specs\approval.spec.ts:36:7

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
- text: /审批查询 A admin 审批查询 业务类型
- combobox:
  - option "全部" [selected]
  - option "账号映射"
  - option "行号映射"
  - option "附言映射"
  - option
  - text: 付款配置
- text: 制单人
- textbox "请输入制单人"
- button "查询"
- button "重置"
- table:
  - rowgroup:
    - row "序号 审批单号 业务类型 操作类型 制单人 制单时间 操作":
      - columnheader "序号"
      - columnheader "审批单号"
      - columnheader "业务类型"
      - columnheader "操作类型"
      - columnheader "制单人"
      - columnheader "制单时间"
      - columnheader "操作"
  - rowgroup:
    - row "1 APR-20260518-001 账号映射 新增 user001 2026-05-18 10:00:00 审批":
      - cell "1"
      - cell "APR-20260518-001"
      - cell "账号映射"
      - cell "新增"
      - cell "user001"
      - cell "2026-05-18 10:00:00"
      - cell "审批":
        - button "审批"
    - row "2 APR-20260518-002 行号映射 修改 user001 2026-05-18 10:05:00 审批":
      - cell "2"
      - cell "APR-20260518-002"
      - cell "行号映射"
      - cell "修改"
      - cell "user001"
      - cell "2026-05-18 10:05:00"
      - cell "审批":
        - button "审批"
    - row "3 APR-20260518-003 付款配置 新增 user002 2026-05-18 10:10:00 审批":
      - cell "3"
      - cell "APR-20260518-003"
      - cell "付款配置"
      - cell "新增"
      - cell "user002"
      - cell "2026-05-18 10:10:00"
      - cell "审批":
        - button "审批"
    - row "4 APR-20260518-004 附言映射 新增 user001 2026-05-18 10:15:00 审批":
      - cell "4"
      - cell "APR-20260518-004"
      - cell "附言映射"
      - cell "新增"
      - cell "user001"
      - cell "2026-05-18 10:15:00"
      - cell "审批":
        - button "审批"
- text: 共 4 条 1 审批详情
- button "✕"
- text: 审批单号 APR-20260518-001 业务类型 账号映射 操作类型 新增 制单人 user001 制单时间 2026-05-18 10:00:00 变更内容 收款账号 6225880999900001 账户名称 陈九 币种 CNY 账户类型 外部 备注 新增测试
- button "拒绝"
- button "通过"
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