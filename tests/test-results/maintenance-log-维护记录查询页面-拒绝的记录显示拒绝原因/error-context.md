# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: maintenance-log.spec.ts >> 维护记录查询页面 >> 拒绝的记录显示拒绝原因
- Location: specs\maintenance-log.spec.ts:53:7

# Error details

```
Error: expect(locator).toContainText(expected) failed

Locator: locator('.modal.show .modal-body')
Expected substring: "拒绝原因"
Timeout: 10000ms
Error: element(s) not found

Call log:
  - Expect "toContainText" with timeout 10000ms
  - waiting for locator('.modal.show .modal-body')

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
- text: 审批单号 APR-20260517-002 业务类型 行号映射 操作类型 修改 制单人 user001 审批状态 拒绝 审批人 user003 审批时间 2026-05-17 10:20:00 变更内容 修改行号 102100099996 行名，拒绝原因：行名格式不规范 拒绝原因 行名格式不规范，请使用全称
- button "关闭"
```

# Test source

```ts
  1  | import { test, expect, navigateTo, openDetailByDblClick, closeModal } from './helpers';
  2  | 
  3  | test.describe('维护记录查询页面', () => {
  4  |   test.beforeEach(async ({ page }) => {
  5  |     await navigateTo(page, 'maintenanceLog');
  6  |   });
  7  | 
  8  |   test('页面标题显示正确', async ({ page }) => {
  9  |     await expect(page.locator('.page-title')).toHaveText('维护记录查询');
  10 |   });
  11 | 
  12 |   test('表格有数据行', async ({ page }) => {
  13 |     const count = await page.locator('tbody tr').count();
  14 |     expect(count).toBeGreaterThan(0);
  15 |   });
  16 | 
  17 |   test('表头包含审批相关列', async ({ page }) => {
  18 |     const headers = page.locator('thead th');
  19 |     const headerTexts = await headers.allTextContents();
  20 |     expect(headerTexts).toContain('审批单号');
  21 |     expect(headerTexts).toContain('业务类型');
  22 |     expect(headerTexts).toContain('审批状态');
  23 |   });
  24 | 
  25 |   test('业务类型筛选包含附言映射', async ({ page }) => {
  26 |     const options = page.locator('select option');
  27 |     const texts = await options.allTextContents();
  28 |     expect(texts).toContain('附言映射');
  29 |   });
  30 | 
  31 |   test('审批状态筛选有全部/待审批/通过/拒绝', async ({ page }) => {
  32 |     const selects = page.locator('select');
  33 |     const statusSelect = selects.nth(1);
  34 |     const options = statusSelect.locator('option');
  35 |     const texts = await options.allTextContents();
  36 |     expect(texts).toContain('全部');
  37 |     expect(texts).toContain('待审批');
  38 |     expect(texts).toContain('通过');
  39 |     expect(texts).toContain('拒绝');
  40 |   });
  41 | 
  42 |   test('双击行打开维护记录详情弹窗', async ({ page }) => {
  43 |     await openDetailByDblClick(page, 0);
  44 |     await expect(page.locator('.modal.show .modal-title')).toContainText('维护记录详情');
  45 |   });
  46 | 
  47 |   test('详情弹窗显示变更内容', async ({ page }) => {
  48 |     await openDetailByDblClick(page, 0);
  49 |     const body = page.locator('.modal.show .modal-body');
  50 |     await expect(body).toContainText('变更内容');
  51 |   });
  52 | 
  53 |   test('拒绝的记录显示拒绝原因', async ({ page }) => {
  54 |     const rows = page.locator('tbody tr');
  55 |     const count = await rows.count();
  56 |     let found = false;
  57 |     for (let i = 0; i < count; i++) {
  58 |       const text = await rows.nth(i).textContent();
  59 |       if (text?.includes('拒绝')) {
  60 |         await rows.nth(i).dblclick();
  61 |         const body = page.locator('.modal.show .modal-body');
> 62 |         await expect(body).toContainText('拒绝原因');
     |                            ^ Error: expect(locator).toContainText(expected) failed
  63 |         found = true;
  64 |         break;
  65 |       }
  66 |     }
  67 |     expect(found).toBeTruthy();
  68 |   });
  69 | 
  70 |   test('附言映射维护记录存在', async ({ page }) => {
  71 |     const rows = page.locator('tbody tr');
  72 |     const count = await rows.count();
  73 |     let found = false;
  74 |     for (let i = 0; i < count; i++) {
  75 |       const text = await rows.nth(i).textContent();
  76 |       if (text?.includes('附言映射')) {
  77 |         found = true;
  78 |         break;
  79 |       }
  80 |     }
  81 |     expect(found).toBeTruthy();
  82 |   });
  83 | 
  84 |   test('点击详情按钮打开弹窗', async ({ page }) => {
  85 |     await page.locator('tbody tr:first-child .btn-link:has-text("详情")').click();
  86 |     await expect(page.locator('.modal.show')).toBeVisible();
  87 |   });
  88 | });
  89 | 
```