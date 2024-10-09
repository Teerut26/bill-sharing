import { createTRPCRouter } from "../../trpc";
import { createExpense, createTrip } from "./create";
import { deleteExpense, deleteTrip } from "./delete";
import { getExpense, getExpenses, getMembersFromTrip, getTrip, getTrips } from "./get";
import { authorizeTrip, joinTrip } from "./update";

export const tripRouter = createTRPCRouter({
  createTrip: createTrip,
  getTrips: getTrips,
  getTrip: getTrip,
  getExpenses: getExpenses,
  getExpense: getExpense,
  createExpense: createExpense,
  deleteExpense: deleteExpense,
  authorizeTrip: authorizeTrip,
  joinTrip: joinTrip,
  getMembersFromTrip: getMembersFromTrip,
  deleteTrip: deleteTrip
});
