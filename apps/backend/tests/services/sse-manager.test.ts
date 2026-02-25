import { describe, it, expect, vi, beforeEach } from "vitest";
import { SSEManager } from "../../src/services/sse-manager.js";
import type { Response } from "express";

function mockResponse(): Response {
  return {
    write: vi.fn(),
    on: vi.fn(),
    setHeader: vi.fn(),
    flushHeaders: vi.fn(),
  } as any;
}

describe("SSEManager", () => {
  let manager: SSEManager;

  beforeEach(() => {
    manager = new SSEManager();
  });

  describe("subscribe / unsubscribe", () => {
    it("adds and removes client", () => {
      const res = mockResponse();
      manager.subscribe("store-1", res);
      expect(manager.getClientCount("store-1")).toBe(1);

      manager.unsubscribe("store-1", res);
      expect(manager.getClientCount("store-1")).toBe(0);
    });

    it("handles multiple clients per store", () => {
      const res1 = mockResponse();
      const res2 = mockResponse();
      manager.subscribe("store-1", res1);
      manager.subscribe("store-1", res2);
      expect(manager.getClientCount("store-1")).toBe(2);
    });
  });

  describe("broadcast", () => {
    it("sends event to all clients of a store", () => {
      const res1 = mockResponse();
      const res2 = mockResponse();
      manager.subscribe("store-1", res1);
      manager.subscribe("store-1", res2);

      manager.broadcast("store-1", "order:created", { order_id: "o1" });

      expect(res1.write).toHaveBeenCalledWith(expect.stringContaining('"order_id":"o1"'));
      expect(res2.write).toHaveBeenCalledWith(expect.stringContaining('"order_id":"o1"'));
    });

    it("does not send to other stores", () => {
      const res1 = mockResponse();
      const res2 = mockResponse();
      manager.subscribe("store-1", res1);
      manager.subscribe("store-2", res2);

      manager.broadcast("store-1", "order:created", { order_id: "o1" });

      expect(res1.write).toHaveBeenCalled();
      expect(res2.write).not.toHaveBeenCalled();
    });

    it("does nothing when no clients", () => {
      expect(() => manager.broadcast("store-none", "order:created", {})).not.toThrow();
    });
  });
});
