import { describe, it, expect, vi } from "vitest";
import { validate } from "../../src/middleware/validate.js";
import { z } from "zod";

describe("validate middleware", () => {
  const schema = z.object({ name: z.string().min(1) });

  it("calls next on valid body", () => {
    const req = { body: { name: "test" } } as any;
    const res = { status: vi.fn().mockReturnThis(), json: vi.fn() } as any;
    const next = vi.fn();

    validate(schema)(req, res, next);
    expect(next).toHaveBeenCalled();
  });

  it("returns 400 on invalid body", () => {
    const req = { body: { name: "" } } as any;
    const res = { status: vi.fn().mockReturnThis(), json: vi.fn() } as any;
    const next = vi.fn();

    validate(schema)(req, res, next);
    expect(res.status).toHaveBeenCalledWith(400);
    expect(next).not.toHaveBeenCalled();
  });
});
