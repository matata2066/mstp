import { test as base, expect } from '@playwright/test';

export const test = base;

export const PAGES = {
  dashboard: '/dashboard.html',
  accountMapping: '/account-mapping.html',
  bankMapping: '/bank-mapping.html',
  remarkMapping: '/remark-mapping.html',
  payerConfig: '/payer-config.html',
  approvalPending: '/approval-pending.html',
  paymentQuery: '/payment-query.html',
  maintenanceLog: '/maintenance-log.html',
};

export async function navigateTo(page, pageKey: string) {
  await page.goto(PAGES[pageKey]);
  await page.waitForLoadState('networkidle');
}

export async function openDetailByDblClick(page, rowIndex: number) {
  const rows = page.locator('tbody tr');
  await rows.nth(rowIndex).dblclick();
  await expect(page.locator('.modal.show')).toBeVisible();
}

export async function closeModal(page) {
  await page.locator('.modal.show .modal-close').click();
  await expect(page.locator('.modal.show')).not.toBeVisible();
}

export async function getTableRowCount(page) {
  return await page.locator('tbody tr').count();
}

export async function clickSidebarMenu(page, menuText: string) {
  await page.locator(`.menu-item:has-text("${menuText}")`).click();
  await page.waitForLoadState('networkidle');
}

export { expect };
