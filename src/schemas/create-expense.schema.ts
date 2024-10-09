import { type z } from "zod";
import { expenseSchema } from "./expense.schema";

export const createExpenseSchema = expenseSchema;

export type CreateExpenseSchemaType = z.infer<typeof createExpenseSchema>;
