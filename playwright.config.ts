import { defineConfig, devices } from "@playwright/test";
import { BASE_URL } from "./src/config/env";   // ✅ correct import

export default defineConfig({
  use: {
    baseURL: BASE_URL,   // ✅ correct usage
    headless: true,
  },

  projects: [
    {
      name: "chromium",
      use: { ...devices["Desktop Chrome"] },
    },
    {
     // name: "firefox",
     // use: { ...devices["Desktop Firefox"] },
    },
    {
      name: "webkit",
      use: { ...devices["Desktop Safari"] },
    },
  ],
});
