import { test, expect } from '@playwright/test';
import { HomePage } from '../../src/pages/HomePage';
import { BankManagerPage } from '../../src/pages/BankManagerPage';
import { OpenAccountPage } from '../../src/pages/OpenAccountPage';
import { CustomersPage } from '../../src/pages/CustomersPage';

test.describe('Bank Manager Operations - Open Account', () => {
  const existingCustomer = 'Harry Potter';

  test.beforeEach(async ({ page }) => {
    // Home → Bank Manager
    const home = new HomePage(page);
    await home.goto();
    await home.loginAsBankManager();

    const manager = new BankManagerPage(page);
    await manager.expectLoaded();
  });

  test('Currencies available: Dollar, Pound, Rupee', async ({ page }) => {
    const manager = new BankManagerPage(page);
    await manager.goToOpenAccount();

    const open = new OpenAccountPage(page);
    await open.expectLoaded();

    // If you kept getAvailableCurrencies() in OpenAccountPage:
    const currencies = await open.getAvailableCurrencies();
    expect(currencies).toEqual(expect.arrayContaining(['Dollar', 'Pound', 'Rupee']));
  });

  test('Open account for existing customer → alert shows new account number → Customers table updated', async ({ page }) => {
    const manager = new BankManagerPage(page);
    await manager.goToOpenAccount();

    const open = new OpenAccountPage(page);
    await open.expectLoaded();

    // 1) Select customer + currency
    await open.selectCustomerByLabel(existingCustomer);
    await open.selectCurrency('Dollar');

    // 2) Submit → capture new account number from alert
    const accountNumber = await open.processAndCaptureAccountNumber();
    expect(accountNumber).toMatch(/^\d+$/);

    // 3) Go to Customers tab
    await manager.goToCustomers();

    // 4) Use Customers page
    const customers = new CustomersPage(page);
    await customers.expectLoaded();

    // Search with first name only (more reliable on this demo app),
    // then verify the same row (Harry + Potter) contains the new account number.
    await customers.searchCustomer('Harry');
    await customers.expectRowContainsAccount(existingCustomer, accountNumber);
  });
});
