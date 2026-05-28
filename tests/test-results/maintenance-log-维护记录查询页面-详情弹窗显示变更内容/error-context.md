# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: maintenance-log.spec.ts >> 维护记录查询页面 >> 详情弹窗显示变更内容
- Location: specs\maintenance-log.spec.ts:47:7

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
- text: /维护记录 A admin 维护记录查询 业务类型
- combobox:
  - option "全部" [selected]
  - option "账号映射"
  - option "行号映射"
  - option "附言映射"
  - option
  - text: 付款配置
- text: 审批状态
- combobox:
  - option "全部" [selected]
  - option "待审批"
  - option "通过"
  - option "拒绝"
- text: 制单人
- textbox "请输入制单人"
- button "查询"
- button "重置"
- table:
  - rowgroup:
    - row "序号 审批单号 业务类型 操作类型 制单人 审批状态 审批人 审批时间 操作":
      - columnheader "序号"
      - columnheader "审批单号"
      - columnheader "业务类型"
      - columnheader "操作类型"
      - columnheader "制单人"
      - columnheader "审批状态"
      - columnheader "审批人"
      - columnheader "审批时间"
      - columnheader "操作"
  - rowgroup:
    - row "1 APR-20260518-001 账号映射 新增 user001 待审批 - - 详情":
      - cell "1"
      - cell "APR-20260518-001"
      - cell "账号映射"
      - cell "新增"
      - cell "user001"
      - cell "待审批"
      - cell "-"
      - cell "-"
      - cell "详情":
        - button "详情"
    - row "2 APR-20260518-002 行号映射 修改 user001 待审批 - - 详情":
      - cell "2"
      - cell "APR-20260518-002"
      - cell "行号映射"
      - cell "修改"
      - cell "user001"
      - cell "待审批"
      - cell "-"
      - cell "-"
      - cell "详情":
        - button "详情"
    - row "3 APR-20260518-003 付款配置 新增 user002 待审批 - - 详情":
      - cell "3"
      - cell "APR-20260518-003"
      - cell "付款配置"
      - cell "新增"
      - cell "user002"
      - cell "待审批"
      - cell "-"
      - cell "-"
      - cell "详情":
        - button "详情"
    - row "4 APR-20260517-001 账号映射 新增 user001 通过 user003 2026-05-17 10:15:00 详情":
      - cell "4"
      - cell "APR-20260517-001"
      - cell "账号映射"
      - cell "新增"
      - cell "user001"
      - cell "通过"
      - cell "user003"
      - cell "2026-05-17 10:15:00"
      - cell "详情":
        - button "详情"
    - row "5 APR-20260517-002 行号映射 修改 user001 拒绝 user003 2026-05-17 10:20:00 详情":
      - cell "5"
      - cell "APR-20260517-002"
      - cell "行号映射"
      - cell "修改"
      - cell "user001"
      - cell "拒绝"
      - cell "user003"
      - cell "2026-05-17 10:20:00"
      - cell "详情":
        - button "详情"
    - row "6 APR-20260516-001 付款配置 新增 user002 通过 user001 2026-05-16 09:30:00 详情":
      - cell "6"
      - cell "APR-20260516-001"
      - cell "付款配置"
      - cell "新增"
      - cell "user002"
      - cell "通过"
      - cell "user001"
      - cell "2026-05-16 09:30:00"
      - cell "详情":
        - button "详情"
    - row "7 APR-20260515-001 账号映射 停用 user002 通过 user003 2026-05-15 14:00:00 详情":
      - cell "7"
      - cell "APR-20260515-001"
      - cell "账号映射"
      - cell "停用"
      - cell "user002"
      - cell "通过"
      - cell "user003"
      - cell "2026-05-15 14:00:00"
      - cell "详情":
        - button "详情"
    - row "8 APR-20260514-001 行号映射 新增 user003 通过 user002 2026-05-14 11:40:00 详情":
      - cell "8"
      - cell "APR-20260514-001"
      - cell "行号映射"
      - cell "新增"
      - cell "user003"
      - cell "通过"
      - cell "user002"
      - cell "2026-05-14 11:40:00"
      - cell "详情":
        - button "详情"
    - row "9 APR-20260513-001 付款配置 修改 user001 拒绝 user002 2026-05-13 15:30:00 详情":
      - cell "9"
      - cell "APR-20260513-001"
      - cell "付款配置"
      - cell "修改"
      - cell "user001"
      - cell "拒绝"
      - cell "user002"
      - cell "2026-05-13 15:30:00"
      - cell "详情":
        - button "详情"
    - row "10 APR-20260512-001 附言映射 新增 user001 通过 user003 2026-05-12 11:00:00 详情":
      - cell "10"
      - cell "APR-20260512-001"
      - cell "附言映射"
      - cell "新增"
      - cell "user001"
      - cell "通过"
      - cell "user003"
      - cell "2026-05-12 11:00:00"
      - cell "详情":
        - button "详情"
    - row "11 APR-20260511-001 附言映射 修改 user002 待审批 - - 详情":
      - cell "11"
      - cell "APR-20260511-001"
      - cell "附言映射"
      - cell "修改"
      - cell "user002"
      - cell "待审批"
      - cell "-"
      - cell "-"
      - cell "详情":
        - button "详情"
- text: 共 11 条 1 维护记录详情
- button "✕"
- text: 审批单号 APR-20260518-001 业务类型 账号映射 操作类型 新增 制单人 user001 审批状态 待审批 审批人 - 审批时间 - 变更内容 新增收款账号 6225880999900001，户名：陈九，币种：CNY
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