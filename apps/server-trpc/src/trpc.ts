import { initTRPC } from "@trpc/server";
import { type createContext } from "./context.js";

export type Context = Awaited<ReturnType<typeof createContext>>;

const t = initTRPC.context<Context>().create();

export const middleware = t.middleware;
export const router = t.router;

export const publicProcedure = t.procedure;
