import { z } from "zod";
import { protectedProcedure } from "../../trpc";

export const authorizeTrip = protectedProcedure
  .input(z.object({ trip_id: z.string(), password: z.string() }))
  .mutation(async ({ input, ctx }) => {
    try {
      const trip = await ctx.db.trip.findUnique({
        where: {
          id: input.trip_id,
        },
      });

      if (trip?.password !== input.password) {
        throw new Error("รหัสไม่ถูกต้อง");
      }

      const result = await ctx.db.trip.update({
        where: {
          id: input.trip_id,
        },
        data: {
          members: {
            connect: {
              email: ctx.session.user.email!,
            },
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

export const joinTrip = protectedProcedure
  .input(z.object({ trip_id: z.string() }))
  .mutation(async ({ input, ctx }) => {
    try {
      const result = await ctx.db.trip.update({
        where: {
          id: input.trip_id,
        },
        data: {
          members: {
            connect: {
              email: ctx.session.user.email!,
            },
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
