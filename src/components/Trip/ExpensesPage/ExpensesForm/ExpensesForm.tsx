import ControlledInputNumber from "@/components/Controlled/ControlledInputNumber";
import ControlledInputText from "@/components/Controlled/ControlledInputText";
import ControlledSelect from "@/components/Controlled/ControlledSelect";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  ActionIcon,
  Alert,
  Avatar,
  Button,
  Group,
  type SelectProps,
  Text,
} from "@mantine/core";
import { type User } from "@prisma/client";
import { IconCalculator, IconPlus, IconTrash } from "@tabler/icons-react";
import { useEffect, useState } from "react";
import { useFieldArray, useForm, useWatch } from "react-hook-form";
import { type UseTRPCQueryResult } from "@trpc/react-query/shared";
import { type inferRouterOutputs } from "@trpc/server";
import { type AppRouter } from "@/server/api/root";
import { type TRPCClientErrorLike } from "@trpc/client";
import {
  expenseSchema,
  type ExpenseSchemaType,
} from "@/schemas/expense.schema";

type DataType = UseTRPCQueryResult<
  inferRouterOutputs<AppRouter>["tripRouter"]["getExpense"],
  TRPCClientErrorLike<AppRouter>
>["data"];

interface Props {
  members: User[];
  data?: DataType;
  mode: "create" | "edit";
  onFinish?: (data: ExpenseSchemaType) => void;
}

export default function ExpensesForm(props: Props) {
  const renderSelectOption: SelectProps["renderOption"] = ({
    option,
    checked,
  }) => {
    const image_url = (email: string) => {
      return props.members.find((item) => item.email === email)?.image;
    };

    return (
      <Group flex="1" gap="xs">
        <Avatar size={"xs"} src={image_url(option.value)} />
        <div>{option.value}</div>
      </Group>
    );
  };

  const [isInited, setIsInited] = useState(false);

  const {
    control,
    setValue,
    handleSubmit,
    formState: { errors },
  } = useForm<ExpenseSchemaType>({
    resolver: zodResolver(expenseSchema),
  });

  const { fields, append, remove } = useFieldArray({
    control: control,
    name: "expense_stakeholder",
  });

  useEffect(() => {
    if (props.data && props.mode === "edit") {
      setValue("name", props.data.name);
      setValue("amount", props.data.amount);
      setValue(
        "expense_stakeholder",
        props.data.expense_stakeholder.map((stakeholder) => ({
          percentage: stakeholder.percentage,
          user_email: stakeholder.stakeholder.email,
        })) as ExpenseSchemaType["expense_stakeholder"],
      );
    }
  }, [props.data, props.mode, setValue]);

  const calculatePercentage = () => {
    for (let index = 0; index < fields.length; index++) {
      setValue(`expense_stakeholder.${index}.percentage`, 100 / fields.length);
    }
  };
  return (
    <>
      <form
        onSubmit={handleSubmit((d) => {
          console.log(d);
          props.onFinish?.(d);
        })}
      >
        <div className="flex flex-col gap-2">
          <ControlledInputText
            control={control}
            name="name"
            props={{
              label: "ชื่อค่าใช้จ่าย",
              placeholder: "กรอกชื่อค่าใช้จ่าย",
              required: true,
              size: "md",
            }}
          />
          <ControlledInputNumber
            control={control}
            name="amount"
            props={{
              label: "จำนวนเงิน",
              placeholder: "กรอกจำนวนเงิน",
              required: true,
              thousandSeparator: true,
              size: "md",
            }}
          />
          <div className="mt-5 flex flex-col gap-2">
            <div className="flex items-center justify-between">
              <Text size="md">สมาชิก</Text>
              <ActionIcon onClick={calculatePercentage}>
                <IconCalculator />
              </ActionIcon>
            </div>
            {errors.expense_stakeholder?.root?.message && (
              <Alert variant="light" color="red" title="เกิดข้อผิดพลาด">
                {errors.expense_stakeholder?.root?.message}
              </Alert>
            )}

            {fields.map((field, index) => (
              <div className="flex w-full items-baseline gap-2" key={field.id}>
                <ControlledSelect
                  control={control}
                  name={`expense_stakeholder.${index}.user_email`}
                  props={{
                    placeholder: "เลือกสมาชิก",
                    required: true,
                    w: "100%",
                    withAsterisk: true,
                    data: props.members.map((member) => ({
                      value: member.email!,
                      label: member.email!,
                    })),
                    renderOption: renderSelectOption,
                  }}
                />
                <ControlledInputNumber
                  control={control}
                  name={`expense_stakeholder.${index}.percentage`}
                  props={{
                    placeholder: "กรอกเปอร์เซ็นต์",
                    required: true,
                    w: 300,
                    leftSection: "%",
                  }}
                />
                <ActionIcon
                  variant="default"
                  onClick={() => {
                    remove(index);
                    // onSharing();
                  }}
                >
                  <IconTrash size={17} />
                </ActionIcon>
              </div>
            ))}
            <div className="flex justify-center">
              <ActionIcon
                variant="default"
                onClick={() => {
                  append({ user_email: "", percentage: 100 });
                }}
              >
                <IconPlus size={17} />
              </ActionIcon>
            </div>
          </div>

          <Button type="submit">บันทึก</Button>
        </div>
      </form>
    </>
  );
}
