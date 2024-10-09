import { createTRPCRouter } from "../../trpc";
import { editExpense, paidExpense, unPaidExpense } from "./update";

export const expenseRouter = createTRPCRouter({
  editExpense: editExpense,
  paidExpense: paidExpense,
  unPaidExpense: unPaidExpense
});
