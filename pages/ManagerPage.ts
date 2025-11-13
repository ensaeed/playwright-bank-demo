import { Page } from '@playwright/test';

export class ManagerPage {
  constructor(private page: Page) {}

  async openAddCustomer() {
    await this.page.getByRole('button', { name: 'Add Customer' }).click();
  }

  async openCustomers() {
    await this.page.getByRole('button', { name: 'Customers' }).click();
  }
}
