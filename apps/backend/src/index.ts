import express from "express";
import { config } from "./config/index.js";
import { errorHandler } from "./middleware/error-handler.js";
import { logger } from "./middleware/logger.js";
import { authRouter } from "./routes/auth.js";
import { tableRouter } from "./routes/table.js";
import { storeRouter } from "./routes/store.js";

export const app = express();

app.use(express.json());
app.use(logger);

app.use("/api/auth", authRouter);
app.use("/api/stores", storeRouter);
app.use("/api/stores", tableRouter);

app.use(errorHandler);

if (process.env.NODE_ENV !== "test") {
  app.listen(config.port, () => {
    console.log(`Server running on port ${config.port}`);
  });
}
