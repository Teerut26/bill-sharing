import { type z } from "zod";
import { expenseSchema } from "./expense.schema";

export const editExpenseSchema = expenseSchema;

export type EditExpenseSchemaType = z.infer<typeof editExpenseSchema>;
