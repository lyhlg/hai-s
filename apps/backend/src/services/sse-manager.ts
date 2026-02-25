import type { Response } from "express";
import type { SSEEventType } from "@hai-s/shared";

export class SSEManager {
  private clients = new Map<string, Set<Response>>();

  subscribe(storeId: string, res: Response): void {
    if (!this.clients.has(storeId)) this.clients.set(storeId, new Set());
    this.clients.get(storeId)!.add(res);
  }

  unsubscribe(storeId: string, res: Response): void {
    this.clients.get(storeId)?.delete(res);
  }

  broadcast(storeId: string, type: SSEEventType, data: unknown): void {
    const clients = this.clients.get(storeId);
    if (!clients) return;
    const payload = `data: ${JSON.stringify({ type, data, timestamp: new Date().toISOString() })}\n\n`;
    for (const res of clients) {
      res.write(payload);
    }
  }

  getClientCount(storeId: string): number {
    return this.clients.get(storeId)?.size ?? 0;
  }
}

// Singleton instance
export const sseManager = new SSEManager();
