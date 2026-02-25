import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    globals: true,
    environment: "node",
    include: ["tests/**/*.test.ts"],
    api: {
      host: "127.0.0.1",
    },
    env: {
      DB_HOST: "127.0.0.1",
      DB_PORT: "3306",
      DB_USER: "test",
      DB_PASSWORD: "test",
      DB_NAME: "test",
      JWT_SECRET: "test-secret",
    },
  },
});
