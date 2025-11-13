import { Page } from '@playwright/test';
import { BASE_URL } from '../config/env';

export class LoginPage {
  readonly page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  async goto() {
    await this.page.goto(BASE_URL);
  }

  async clickManagerLogin() {
    await this.page.getByRole('button', { name: 'Bank Manager Login' }).click();
  }
}
