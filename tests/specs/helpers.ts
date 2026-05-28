import { test as base, expect, type Page } from '@playwright/test';

export const test = base;

export const PAGES: Record<string, string> = {
  dashboard: '/dashboard.html',
  accountMapping: '/account-mapping.html',
  bankMapping: '/bank-mapping.html',
  remarkMapping: '/remark-mapping.html',
  payerConfig: '/payer-config.html',
  approvalPending: '/approval-pending.html',
  paymentQuery: '/payment-query.html',
  maintenanceLog: '/maintenance-log.html',
};

export async function navigateTo(page: Page, pageKey: string): Promise<void> {
  await page.goto(PAGES[pageKey]);
  await page.waitForLoadState('networkidle');
}

export async function openDetailByDblClick(page: Page, rowIndex: number): Promise<void> {
  const rows = page.locator('tbody tr');
  await rows.nth(rowIndex).dblclick();
  await expect(page.locator('.modal-overlay.show')).toBeVisible();
}

export async function closeModal(page: Page): Promise<void> {
  await page.locator('.modal-overlay.show .modal-close').click();
  await expect(page.locator('.modal-overlay.show')).not.toBeVisible();
}

export async function getTableRowCount(page: Page): Promise<number> {
  return await page.locator('tbody tr').count();
}

export async function clickSidebarMenu(page: Page, menuText: string): Promise<void> {
  await page.locator(`.menu-item:has-text("${menuText}")`).click();
  await page.waitForLoadState('networkidle');
}

export { expect };
