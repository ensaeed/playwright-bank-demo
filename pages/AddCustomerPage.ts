// src/pages/AddCustomerPage.ts
import { Page } from '@playwright/test';

export class AddCustomerPage {
  constructor(private page: Page) {}

  async addCustomer(first: string, last: string, postCode: string) {
    // Fill customer details
    await this.page.getByPlaceholder('First Name').fill(first);
    await this.page.getByPlaceholder('Last Name').fill(last);
    await this.page.getByPlaceholder('Post Code').fill(postCode);

    // Locate submit button inside the form
    const submitBtn = this.page.locator('form button[type="submit"]');

    let message = '';

    // Capture the alert message
    this.page.once('dialog', async (dialog) => {
      message = dialog.message();
      await dialog.accept();
    });

    // Click submit
    await submitBtn.click();

    // Small wait to ensure message is captured
    await this.page.waitForTimeout(500);

    return message;
  }
}
