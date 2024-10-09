/*
  Warnings:

  - The primary key for the `expense_stakeholder` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `id` on the `expense_stakeholder` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "expense_stakeholder" DROP CONSTRAINT "expense_stakeholder_pkey",
DROP COLUMN "id",
ADD CONSTRAINT "expense_stakeholder_pkey" PRIMARY KEY ("stakeholderId", "expenseId");
