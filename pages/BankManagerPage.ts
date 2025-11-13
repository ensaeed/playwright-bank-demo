import { Page, Locator, expect } from '@playwright/test';

export class BankManagerPage {
  readonly page: Page;
  readonly openAccountTab: Locator;
  readonly customersTab: Locator;

  constructor(page: Page) {
    this.page = page;

    this.openAccountTab = page.getByRole('button', { name: /open account/i });
    this.customersTab   = page.getByRole('button', { name: /customers/i });
  }

  async expectLoaded() {
    await expect(this.openAccountTab).toBeVisible();
    await expect(this.customersTab).toBeVisible();
  }

  async goToOpenAccount() {
    await this.openAccountTab.click();
  }

  async goToCustomers() {
    await this.customersTab.click();
  }
}
