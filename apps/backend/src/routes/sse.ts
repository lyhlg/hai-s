import { Router, Request, Response } from 'express';

const router = Router();

// TODO: Phase 2 - 개발자 B가 구현
// GET /sse/orders - 주문 실시간 이벤트 스트림

router.get('/orders', (req: Request, res: Response) => {
  res.setHeader('Content-Type', 'text/event-stream');
  res.setHeader('Cache-Control', 'no-cache');
  res.setHeader('Connection', 'keep-alive');
  
  // TODO: SSE 구현
  res.write('data: {"type":"connected"}\n\n');
});

export default router;
