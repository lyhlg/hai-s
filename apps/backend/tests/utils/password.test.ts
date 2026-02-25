import { describe, it, expect } from "vitest";
import { hashPassword, comparePassword } from "../../src/utils/password.js";

describe("password utils", () => {
  it("hashPassword returns a bcrypt hash", async () => {
    const hash = await hashPassword("test123");
    expect(hash).toBeDefined();
    expect(hash).not.toBe("test123");
    expect(hash.startsWith("$2a$") || hash.startsWith("$2b$")).toBe(true);
  });

  it("comparePassword returns true for matching password", async () => {
    const hash = await hashPassword("test123");
    const result = await comparePassword("test123", hash);
    expect(result).toBe(true);
  });

  it("comparePassword returns false for wrong password", async () => {
    const hash = await hashPassword("test123");
    const result = await comparePassword("wrong", hash);
    expect(result).toBe(false);
  });
});
