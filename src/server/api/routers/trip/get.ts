import { z } from "zod";
import { protectedProcedure } from "../../trpc";
import _ from "lodash";

export const getTrips = protectedProcedure.query(async ({ ctx }) => {
  try {
    const result = await ctx.db.trip.findMany({
      include: {
        expense: {
          select: {
            amount: true,
          },
        },
        members: {
          select: {
            image: true,
          },
        },
      },
    });
    return result.map((item) => ({
      ...item,
      total_expense: !item.password
        ? _.sumBy(item.expense, (o) => o.amount)
        : null,
      password: item.password ? true : false,
      members: !item.password ? item.members : null,
    }));
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(error.message);
    }
  }
});

export const getTrip = protectedProcedure
  .input(z.string())
  .query(async ({ ctx, input }) => {
    try {
      const result = await ctx.db.trip.findUnique({
        where: {
          id: input,
        },
        include: {
          owner: true,
          members: true,
          expense: {
            select: {
              amount: true,
            },
          },
        },
      });
      return {
        ...result,
        total_expense: _.sumBy(result?.expense, (o) => o.amount),
        password: result?.password ? true : false,
      };
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(error.message);
      }
    }
  });

export const getMembersFromTrip = protectedProcedure
  .input(
    z.object({
      trip_id: z.string(),
    }),
  )
  .query(async ({ ctx, input }) => {
    try {
      const result = await ctx.db.trip.findUnique({
        where: {
          id: input.trip_id,
        },
        select: {
          members: {
            select: {
              email: true,
              image: true,
            },
          },
        },
      });
      return result?.members;
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(error.message);
      }
    }
  });

export const getExpenses = protectedProcedure
  .input(
    z.object({
      trip_id: z.string(),
    }),
  )
  .query(async ({ ctx, input }) => {
    try {
      const result =
        (
          await ctx.db.trip.findUnique({
            where: {
              id: input.trip_id,
            },
            select: {
              expense: {
                include: {
                  owner: true,
                  expense_stakeholder: true,
                },
                orderBy: {},
              },
            },
          })
        )?.expense ?? [];
      return {
        expenses: result,
        sum_expense: _.sumBy(result, (o) => o.amount),
      };
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(error.message);
      }
    }
  });

export const getExpense = protectedProcedure
  .input(
    z.object({
      expense_id: z.string(),
    }),
  )
  .query(async ({ ctx, input }) => {
    try {
      const result = await ctx.db.expense.findUnique({
        where: {
          id: input.expense_id,
        },
        include: {
          owner: true,
          expense_stakeholder: {
            include: {
              stakeholder: true,
            },
            orderBy: {
              createdAt: "desc",
            }
          },
        },
      });
      return result;
    } catch (error) {}
  });
