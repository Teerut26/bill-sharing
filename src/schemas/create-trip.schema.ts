import { z } from "zod";

export const createTripSchema = z.object({
  name: z
    .string({ required_error: "กรุณากรอกชื่อทริป" })
    .min(1, "กรุณากรอกชื่อทริป"),
});

export type CreateTripSchemaType = z.infer<typeof createTripSchema>;
