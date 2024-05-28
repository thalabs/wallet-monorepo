import cors from "cors";
import express from "express";
import * as trpcExpress from "@trpc/server/adapters/express";
import { createContext } from "./context.js";
import { appRouter } from "./index.js";

const app = express();

app.use(cors());

app.use(
	"/trpc/",
	trpcExpress.createExpressMiddleware({
		batching: {
			enabled: false,
		},
		createContext,
		router: appRouter,
	}),
);

app.listen(4000);

export type AppRouter = typeof appRouter;
