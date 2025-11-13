import { Page, Locator, expect } from '@playwright/test';
import { BASE_URL } from '../config/env';

export class HomePage {
  readonly page: Page;
  readonly bankManagerLoginBtn: Locator;

  constructor(page: Page) {
    this.page = page;

    // ✅ INIT LOCATORS HERE
    this.bankManagerLoginBtn = page.getByRole('button', { name: /bank manager login/i });
  }

  async goto() {
    await this.page.goto(BASE_URL);
    await expect(this.bankManagerLoginBtn).toBeVisible();
  }

  async loginAsBankManager() {
    await this.bankManagerLoginBtn.click();
  }
}
