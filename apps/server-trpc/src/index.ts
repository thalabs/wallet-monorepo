import { publicProcedure, router } from "./trpc.js";
import { z } from "zod";
export const appRouter = router({
  todos: publicProcedure.query(() => {
    return [
      {
        id: 1,
        text: "Buy milk",
      },
      {
        id: 2,
        text: "Buy bread",
      },
    ];
  }),
  addTodo: publicProcedure
    .input(
      z.object({
        text: z.string(),
      })
    )
    .mutation(({ input }) => {
      return {
        id: 3,
        text: input.text,
      };
    }),
});

export type AppRouter = typeof appRouter;