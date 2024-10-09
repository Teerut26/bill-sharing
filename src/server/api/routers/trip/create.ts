import { createTripSchema } from "@/schemas/create-trip.schema";
import { protectedProcedure } from "../../trpc";
import { createExpenseSchema } from "@/schemas/create-expense.schema";
import { z } from "zod";
import _ from "lodash";

export const createTrip = protectedProcedure
  .input(createTripSchema)
  .mutation(async ({ input, ctx }) => {
    try {
      return await ctx.db.trip.create({
        data: {
          ...input,
          owner: {
            connect: { email: ctx.session.user.email! },
          },
          members: {
            connect: [
                {
                    email: ctx.session.user.email!,
                }
            ],
          },
        },
      });
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(error.message);
      }
    }
  });

export const createExpense = protectedProcedure
  .input(createExpenseSchema)
  .input(z.object({ trip_id: z.string() }))
  .mutation(async ({ input, ctx }) => {
    const data = _.omit(input, "trip_id");
    try {
      return await ctx.db.expense.create({
        data: {
          ...data,
          owner: {
            connect: { email: ctx.session.user.email! },
          },
          trip: {
            connect: {
              id: input.trip_id,
            },
          },
          expense_stakeholder: {
            create: data.expense_stakeholder.map((stakeholder) => ({
              stakeholder: {
                connect: {
                  email: stakeholder.user_email,
                },
              },
              percentage: stakeholder.percentage,
            })),
          },
        },
      });
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(error.message);
      }
    }
  });
