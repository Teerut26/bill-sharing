import _ from "lodash";
import { z } from "zod";
import { protectedProcedure } from "../../trpc";

export const deleteExpense = protectedProcedure
  .input(z.object({ expense_id: z.string() }))
  .mutation(async ({ input, ctx }) => {
    try {
      return await ctx.db.expense.delete({
        where: {
          id: input.expense_id,
        },
      });
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(error.message);
      }
    }
  });
