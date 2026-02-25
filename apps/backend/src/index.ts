import express from "express";
import { config } from "./config/index.js";
import { errorHandler } from "./middleware/error-handler.js";
import { logger } from "./middleware/logger.js";
import { authRouter } from "./routes/auth.js";
import { tableRouter } from "./routes/table.js";
import { storeRouter } from "./routes/store.js";
import menuRouter from "./routes/menu.js";
import orderRouter from "./routes/order.js";
import settlementRouter from "./routes/settlement.js";
import sseRouter from "./routes/sse.js";

export const app = express();

app.use(express.json());
app.use(logger);

// Phase 1 routes (개발자 B)
app.use("/api/auth", authRouter);
app.use("/api/stores", storeRouter);
app.use("/api/stores", tableRouter);

// Phase 2 routes
app.use("/api/menu", menuRouter); // 개발자 A
app.use("/api/orders", orderRouter); // 개발자 B
app.use("/api/sse", sseRouter); // 개발자 B

// Phase 3 routes
app.use("/api/settlement", settlementRouter); // 개발자 A

app.use(errorHandler);

if (process.env.NODE_ENV !== "test") {
  app.listen(config.port, () => {
    console.log(`Server running on port ${config.port}`);
  });
}
