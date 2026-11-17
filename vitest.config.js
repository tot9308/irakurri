import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    globals: true,
    environment: "node",
    include: ["apps/web/tests/unit/**/*.test.ts"],
  },
  resolve: {
    alias: {
      "@": new URL("./apps/web", import.meta.url).pathname,
    },
  },
});
