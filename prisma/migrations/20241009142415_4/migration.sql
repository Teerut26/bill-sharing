-- DropForeignKey
ALTER TABLE "expense_stakeholder" DROP CONSTRAINT "expense_stakeholder_stakeholderId_fkey";

-- AddForeignKey
ALTER TABLE "expense_stakeholder" ADD CONSTRAINT "expense_stakeholder_stakeholderId_fkey" FOREIGN KEY ("stakeholderId") REFERENCES "User"("email") ON DELETE RESTRICT ON UPDATE CASCADE;
