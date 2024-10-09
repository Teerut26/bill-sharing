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

export const paidExpense = protectedProcedure
  .input(z.object({ stakeholderId: z.string(), expenseId: z.string() }))
  .mutation(async ({ input, ctx }) => {
    try {
      const expense = await ctx.db.expense.findUnique({
        where: {
          id: input.expenseId,
        },
        include: {
            owner: true
        }
      });

      if (expense?.owner.email !== ctx.session.user.email) {
        throw new Error("คุณไม่มีสิทธิ์ เข้าถึงข้อมูลนี้");
      }

      const result = await ctx.db.expense_stakeholder.update({
        where: {
          stakeholderId_expenseId: {
            expenseId: input.expenseId,
            stakeholderId: input.stakeholderId,
          },
        },
        data: {
          paid: true,
        },
      });
      return result;
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(error.message);
      }
    }
  });
export const unPaidExpense = protectedProcedure
  .input(z.object({ stakeholderId: z.string(), expenseId: z.string() }))
  .mutation(async ({ input, ctx }) => {
    try {
      const expense = await ctx.db.expense.findUnique({
        where: {
          id: input.expenseId,
        },
        include: {
            owner: true
        }
      });

      if (expense?.owner.email !== ctx.session.user.email) {
        throw new Error("คุณไม่มีสิทธิ์ เข้าถึงข้อมูลนี้");
      }

      const result = await ctx.db.expense_stakeholder.update({
        where: {
          stakeholderId_expenseId: {
            expenseId: input.expenseId,
            stakeholderId: input.stakeholderId,
          },
        },
        data: {
          paid: false,
        },
      });
      return result;
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(error.message);
      }
    }
  });
