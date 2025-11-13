import { Page, Locator, expect } from '@playwright/test';

export class OpenAccountPage {
  readonly page: Page;
  readonly customerSelect: Locator;
  readonly currencySelect: Locator;
  readonly processBtn: Locator;

  constructor(page: Page) {
    this.page = page;

    this.customerSelect = page.locator('select#userSelect');
    this.currencySelect = page.locator('select#currency');
    this.processBtn     = page.getByRole('button', { name: /process/i });
  }

  async expectLoaded() {
    await expect(this.customerSelect).toBeVisible();
    await expect(this.currencySelect).toBeVisible();
    await expect(this.processBtn).toBeVisible();
  }

  async selectCustomerByLabel(label: string) {
    await this.customerSelect.selectOption({ label });
  }

  async selectCurrency(label: string) {
    await this.currencySelect.selectOption({ label });
  }

  // ✅ No explicit Promise<...> return type; TS will infer it.
  async getAvailableCurrencies() {
    const texts = await this.currencySelect.locator('option').allInnerTexts();
    // Trim and drop any placeholder/empty options the demo might include
    return texts.map(t => t.trim()).filter(t => t && t.toLowerCase() !== 'currency');
  }

  // ✅ Click → capture alert → extract account number
  async processAndCaptureAccountNumber() {
    let message = '';
    this.page.once('dialog', async (dialog) => {
      message = dialog.message();
      await dialog.accept();
    });

    await this.processBtn.click();

    const match = message.match(/Account created successfully\s*with account Number\s*:\s*(\d+)/i);
    if (!match) throw new Error(`Could not parse account number from alert: "${message}"`);
    return match[1];
  }
}
