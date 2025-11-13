// tests/add-customer.spec.ts
import { test, expect } from '@playwright/test';
import { LoginPage } from '../src/pages/LoginPage';
import { ManagerPage } from '../src/pages/ManagerPage';
import { AddCustomerPage } from '../src/pages/AddCustomerPage';
import { CustomersPage } from '../src/pages/CustomersPage';
import customerData from '../src/data/customerData.json';

const { validCustomer, duplicateCustomer } = customerData;

test('Add customer → success message + row visible', async ({ page }) => {
  const login = new LoginPage(page);
  const manager = new ManagerPage(page);
  const add = new AddCustomerPage(page);
  const customers = new CustomersPage(page);

  await login.goto();
  await login.clickManagerLogin()
  await manager.openAddCustomer();

  // Make first name unique to avoid accidental duplicate
  const fname = `${validCustomer.firstName}${Date.now()}`;
  const lname = validCustomer.lastName;
  const pcode = validCustomer.postCode;

  const msg = await add.addCustomer(fname, lname, pcode);
  expect(msg).toMatch(/Customer added successfully/i);
  expect(msg).toMatch(/customer id\s*:/i);

  await manager.openCustomers();
  await customers.search(fname);
  //await expect(customers.rowByName(fname, lname)).toHaveCount(1);
  const row = customers.rowByName(fname, lname);

await expect(row).toHaveCount(1);
await expect(row).toContainText(fname);
await expect(row).toContainText(lname);
await expect(row).toContainText(pcode);

});
test('Duplicate customer → duplicate warning', async ({ page }) => {
  const login = new LoginPage(page);
  const manager = new ManagerPage(page);
  const add = new AddCustomerPage(page);

  await login.goto();
  await login.clickManagerLogin();
  await manager.openAddCustomer();

  const { firstName, lastName, postCode } = duplicateCustomer;

  const firstMsg = await add.addCustomer(firstName, lastName, postCode);
  expect(firstMsg).toMatch(/Customer added successfully/i);

  const secondMsg = await add.addCustomer(firstName, lastName, postCode);
  expect(secondMsg).toMatch(/Customer may be duplicate/i);
});
