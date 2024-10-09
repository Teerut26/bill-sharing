import { z } from "zod";

export const createTripSchema = z.object({
  name: z
    .string({ required_error: "กรุณากรอกชื่อทริป" })
    .min(1, "กรุณากรอกชื่อทริป"),
  location: z.string().optional(),
  start_date: z.date().nullable().optional(),
  end_date: z.date().nullable().optional(),
  isPublic: z.boolean().optional(),
  password: z.string().optional(),
});

export type CreateTripSchemaType = z.infer<typeof createTripSchema>;
