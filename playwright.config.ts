import { defineConfig } from "@playwright/test";

export default defineConfig({
  testDir: "./tests/e2e",
  timeout: 40000,
  fullyParallel: false,
  reporter: [["list"]],
  use: {
    baseURL: "http://localhost:3100",
    channel: "chrome",
    viewport: { width: 1024, height: 768 },
    trace: "off",
  },
  webServer: {
    command: "npm run build && npm run start -- -p 3100",
    url: "http://localhost:3100/invitado",
    reuseExistingServer: true,
    timeout: 180000,
  },
});
