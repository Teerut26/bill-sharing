import { z } from "zod";

const expenseStakeholderSchema = z.object({
  percentage: z.number({ required_error: "กรุณากรอกเปอร์เซนต์" }),
  user_email: z
    .string({ required_error: "กรุณากรอก email" })
    .min(1, "กรุณากรอก email"),
});

export const expenseSchema = z
  .object({
    name: z
      .string({ required_error: "กรุณากรอกชื่อรายการค่าใช้จ่าย" })
      .min(1, "กรุณากรอกชื่อรายการค่าใช้จ่าย"),
    amount: z.number({ required_error: "กรุณากรอกจำนวนเงิน" }),
    expense_stakeholder: z
      .array(expenseStakeholderSchema)
      .nonempty("ต้องมีผู้รับผิดชอบค่าใช้จ่ายอย่างน้อยหนึ่งคน"),
  })
  .refine(
    (data) => {
      const emails = data.expense_stakeholder.map(
        (stakeholder) => stakeholder.user_email,
      );
      return new Set(emails).size === emails.length;
    },
    {
      message: "อีเมลผู้รับผิดชอบต้องไม่ซ้ำกัน",
      path: ["expense_stakeholder"],
    },
  );

export type ExpenseSchemaType = z.infer<typeof expenseSchema>;
