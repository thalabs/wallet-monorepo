import { z } from "zod";
import { publicProcedure, router } from "./trpc.js";

export const appRouter = router({
	addTodo: publicProcedure
		.input(
			z.object({
				text: z.string(),
			}),
		)
		.mutation(({ input }) => {
			return {
				id: 3,
				text: input.text,
			};
		}),
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
});

export type AppRouter = typeof appRouter;
