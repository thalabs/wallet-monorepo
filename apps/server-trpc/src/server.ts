import cors from "cors";
import express from "express";
import * as trpcExpress from "@trpc/server/adapters/express";

import { appRouter } from "./index.js";
import { createContext } from "./context.js";

const app = express();

app.use(cors());

app.use(
  "/trpc/",
  trpcExpress.createExpressMiddleware({
    router: appRouter,
    createContext,
    batching: {
      enabled: false,
    }
  })
);

app.listen(4000);

export type AppRouter = typeof appRouter;