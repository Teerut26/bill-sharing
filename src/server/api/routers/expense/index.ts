import { createTRPCRouter } from "../../trpc";
import { editExpense } from "./update";

export const expenseRouter = createTRPCRouter({
  editExpense: editExpense,
});
