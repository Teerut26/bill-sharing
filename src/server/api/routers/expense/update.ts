import { z } from "zod";
import { protectedProcedure } from "../../trpc";
import { editExpenseSchema } from "@/schemas/edit-expense.schema";
import _ from "lodash";

export const editExpense = protectedProcedure
  .input(z.object({ expense_id: z.string() }))
  .input(editExpenseSchema)
  .mutation(async ({ input, ctx }) => {
    try {
      const data = _.omit(input, "expense_id");

      await ctx.db.expense_stakeholder.deleteMany({
        where: {
          expenseId: input.expense_id,
        },
      });

      const result = await ctx.db.expense.update({
        where: {
          id: input.expense_id,
        },
        data: {
          ...data,
          expense_stakeholder: {
            create: data.expense_stakeholder.map((stakeholder) => ({
              percentage: stakeholder.percentage,
              stakeholder: {
                connect: {
                  email: stakeholder.user_email,
                },
              },
            })),
          },
        },
      });

      return result;
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(error.message);
      }
    }
  });
