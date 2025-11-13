import { Page, Locator, expect } from '@playwright/test';

export class CustomersPage {
  readonly page: Page;
  readonly searchInput: Locator;
  readonly rows: Locator;

  constructor(page: Page) {
    this.page = page;
    this.searchInput = page.locator('input[ng-model="searchCustomer"]');
    this.rows = page.locator('table tbody tr'); // simple, reliable
  }

  async expectLoaded() {
    await expect(this.searchInput).toBeVisible();
    // wait until table has at least one row rendered
    await expect(this.rows.first()).toBeVisible({ timeout: 10000 });
  }

  async searchCustomer(text: string) {
    await this.searchInput.fill('');
    await this.searchInput.type(text);
    // allow Angular filter to apply
    await expect(this.rows.first()).toBeVisible({ timeout: 10000 });
  }

  /**
   * Matches a row that contains BOTH first and last name, then checks the account number in that row.
   */
  async expectRowContainsAccount(fullName: string, accountNumber: string) {
    const [first, ...rest] = fullName.trim().split(/\s+/);
    const last = rest.join(' ').trim();

    let row = this.rows.filter({ hasText: new RegExp(`\\b${first}\\b`, 'i') });
    if (last) {
      row = row.filter({ hasText: new RegExp(`\\b${last}\\b`, 'i') });
    }

    await expect(row.first(), `Row for "${fullName}" should be visible`).toBeVisible({ timeout: 10000 });
    await expect(row.first(), `Row for "${fullName}" should include account ${accountNumber}`)
      .toContainText(new RegExp(`\\b${accountNumber}\\b`), { timeout: 10000 });
  }
}
