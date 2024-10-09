import ControlledInputNumber from "@/components/Controlled/ControlledInputNumber";
import ControlledInputText from "@/components/Controlled/ControlledInputText";
import ControlledSelect from "@/components/Controlled/ControlledSelect";
import {
  createExpenseSchema,
  type CreateExpenseSchemaType,
} from "@/schemas/create-expense.schema";
import { api } from "@/utils/api";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  ActionIcon,
  Alert,
  Avatar,
  Badge,
  Button,
  Card,
  Chip,
  Drawer,
  Group,
  Modal,
  NumberFormatter,
  SelectProps,
  Skeleton,
  Text,
} from "@mantine/core";
import { useDisclosure, useMediaQuery } from "@mantine/hooks";
import { modals } from "@mantine/modals";
import { notifications } from "@mantine/notifications";
import { IconTrash, IconPlus } from "@tabler/icons-react";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { useFieldArray, useForm } from "react-hook-form";

interface Props {
  trip_id: string;
}

export default function ExpensesPage(props: Props) {
  const { data: session } = useSession();
  const getTripApi = api.tripRouter.getTrip.useQuery(props.trip_id ?? "");
  const isMobile = useMediaQuery("(max-width: 768px)");
  const deleteExpenseApi = api.tripRouter.deleteExpense.useMutation();
  const getExpensesApi = api.tripRouter.getExpenses.useQuery({
    trip_id: props.trip_id ?? "",
  });
  const createExpenseApi = api.tripRouter.createExpense.useMutation();

  const [
    openedActionDrawer,
    { open: openActionDrawer, close: closeActionDrawer },
  ] = useDisclosure(false);
  const [
    openedAddExpenseModal,
    { open: openAddExpenseModal, close: closeAddExpenseModal },
  ] = useDisclosure(false);

  const {
    control: createExpenseControl,
    setValue: setCreateExpenseValue,
    handleSubmit: createExpenseSubmit,
    reset: createExpenseReset,
    formState: { errors: createExpenseErrors },
  } = useForm<CreateExpenseSchemaType>({
    resolver: zodResolver(createExpenseSchema),
  });

  const { fields, append, remove } = useFieldArray({
    control: createExpenseControl, // control props comes from useForm (optional: if you are using FormProvider)
    name: "expense_stakeholder", // unique name for your Field Array
  });

  type ExpenseType = NonNullable<
    typeof getExpensesApi.data
  >["expenses"] extends (infer T)[] | null | undefined
    ? T
    : never;
  const [keyForm, setKeyForm] = useState(0);
  const [SetForAction, setSetForAction] = useState<ExpenseType>();

  const getExpenseApi = api.tripRouter.getExpense.useQuery({
    expense_id: SetForAction?.id ?? "",
  });

  useEffect(() => {
    for (let index = 0; index < fields.length; index++) {
      setCreateExpenseValue(
        `expense_stakeholder.${index}.percentage`,
        100 / fields.length,
      );
    }
  }, [fields.length, setCreateExpenseValue]);

  const isMember = getTripApi.data?.members?.some(
    (member) => member.email === session?.user?.email,
  );

  const renderSelectOption: SelectProps["renderOption"] = ({
    option,
    checked,
  }) => {
    const image_url = (email: string) => {
      return getTripApi.data?.members?.find((item) => item.email === email)
        ?.image;
    };
    return (
      <Group flex="1" gap="xs">
        <Avatar size={"xs"} src={image_url(option.value)} />
        <div>{option.value}</div>
      </Group>
    );
  };

  const isOwner = getTripApi.data?.owner?.email === session?.user?.email;

  return (
    <>
      <Modal
        fullScreen={isMobile}
        size="70%"
        opened={openedAddExpenseModal}
        onClose={closeAddExpenseModal}
        title="เพิ่มค่าใช้จ่าย"
      >
        <form
          key={keyForm}
          onSubmit={createExpenseSubmit((d) => {
            const keyNotification = notifications.show({
              title: "กําลังสร้างค่าใช้จ่าย",
              loading: true,
              autoClose: false,
              disallowClose: true,
              message: "กรุณารอสักครู่...",
            });
            createExpenseApi.mutate(
              {
                ...d,
                trip_id: props.trip_id ?? "",
              },
              {
                onSuccess: () => {
                  notifications.update({
                    color: "green",
                    title: "สร้างค่าใช้จ่ายสําเร็จ",
                    message: "ค่าใช้จ่ายของคุณถูกสร้างเรียบร้อยแล้ว",
                    loading: false,
                    autoClose: 3000,
                    id: keyNotification,
                  });
                  setKeyForm((prev) => prev + 1);
                  closeAddExpenseModal();
                  void getExpensesApi.refetch();
                },
                onError: (error) => {
                  notifications.update({
                    color: "red",
                    title: "สร้างค่าใช้จ่ายไม่สําเร็จ",
                    message: error.message,
                    loading: false,
                    autoClose: 3000,
                    id: keyNotification,
                  });
                },
              },
            );
            console.log(d);
          })}
        >
          <div className="flex flex-col gap-2">
            <ControlledInputText
              control={createExpenseControl}
              name="name"
              props={{
                label: "ชื่อค่าใช้จ่าย",
                placeholder: "กรอกชื่อค่าใช้จ่าย",
                required: true,
                size: "md",
              }}
            />
            <ControlledInputNumber
              control={createExpenseControl}
              name="amount"
              props={{
                label: "จำนวนเงิน",
                placeholder: "กรอกจำนวนเงิน",
                required: true,
                thousandSeparator: true,
                size: "md",
              }}
            />
            <div className="mt-5 flex flex-col items-center gap-2">
              <Text size="md">สมาชิก</Text>
              {createExpenseErrors.expense_stakeholder?.root?.message && (
                <Alert variant="light" color="red" title="เกิดข้อผิดพลาด">
                  {createExpenseErrors.expense_stakeholder?.root?.message}
                </Alert>
              )}

              {fields.map((field, index) => (
                <div
                  className="flex w-full items-baseline gap-2"
                  key={field.id}
                >
                  <ControlledSelect
                    control={createExpenseControl}
                    name={`expense_stakeholder.${index}.user_email`}
                    props={{
                      placeholder: "เลือกสมาชิก",
                      required: true,
                      w: "100%",
                      withAsterisk: true,
                      data: getTripApi.data?.members?.map((member) => ({
                        value: member.email!,
                        label: member.email!,
                      })),
                      renderOption: renderSelectOption,
                    }}
                  />
                  <ControlledInputNumber
                    control={createExpenseControl}
                    name={`expense_stakeholder.${index}.percentage`}
                    props={{
                      placeholder: "กรอกเปอร์เซ็นต์",
                      required: true,
                      w: 300,
                      leftSection: "%",
                    }}
                  />
                  <ActionIcon variant="default" onClick={() => remove(index)}>
                    <IconTrash size={17} />
                  </ActionIcon>
                </div>
              ))}
              <ActionIcon
                variant="default"
                onClick={() => append({ user_email: "", percentage: 100 })}
              >
                <IconPlus size={17} />
              </ActionIcon>
            </div>

            <Button type="submit">บันทึก</Button>
          </div>
        </form>
      </Modal>
      <Drawer
        size="60%"
        opened={openedActionDrawer}
        position="bottom"
        onClose={() => {
          setSetForAction(undefined);
          closeActionDrawer();
        }}
        title="ดำเนินการ"
      >
        <div className="flex flex-col gap-3">
          {isOwner && (
            <>
              <Button>แก้ไข</Button>
              <Button
                onClick={() => {
                  modals.openConfirmModal({
                    title: "ลบค่าใช้จ่าย",
                    centered: true,
                    children: (
                      <Text size="sm">
                        คุณต้องการลบค่าใช้จ่าย{" "}
                        <strong>{SetForAction?.name}</strong> ใช่หรือไม่
                      </Text>
                    ),
                    labels: { confirm: "ลบ", cancel: "ยกเลิก" },
                    confirmProps: { color: "red" },
                    onConfirm: () => {
                      if (!getExpenseApi.data?.id) {
                        notifications.show({
                          title: "ลบค่าใช้จ่ายไม่สําเร็จ",
                          message: "ไม่พบค่าใช้จ่ายที่ต้องการลบ",
                          loading: false,
                          autoClose: 3000,
                          color: "red",
                        });
                        return;
                      }
                      deleteExpenseApi.mutate(
                        {
                          expense_id: getExpenseApi.data?.id,
                        },
                        {
                          onSuccess: () => {
                            closeActionDrawer();
                            notifications.show({
                              title: "ลบค่าใช้จ่ายสําเร็จ",
                              message: "ลบค่าใช้จ่ายสำเร็จแล้ว",
                              loading: false,
                              autoClose: 3000,
                              color: "green",
                            });
                            void getExpensesApi.refetch();
                          },
                        },
                      );
                    },
                  });
                }}
                loading={deleteExpenseApi.isPending}
                color="red"
              >
                ลบ
              </Button>
            </>
          )}
          <Card className="flex flex-col gap-1" px={0}>
            <Text size="lg">{SetForAction?.name}</Text>
            <div className="flex flex-col">
              <NumberFormatter
                prefix="฿ "
                value={SetForAction?.amount}
                thousandSeparator

                className="text-2xl font-bold"
              />
            </div>
            <div className="flex flex-col gap-2">
              {getExpenseApi.data?.expense_stakeholder.map((item, index) => (
                <Card px={10} py={3} withBorder key={index}>
                  <div className="flex items-center gap-2">
                    <Avatar size={"xs"} src={item.stakeholder.image} />
                    <Text>{item.stakeholder.email}</Text>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant="gradient">{item.percentage.toFixed(2)}%</Badge>
                    <NumberFormatter
                      className="font-bold"
                      value={
                        SetForAction?.amount
                          ? (item.percentage / 100) * SetForAction.amount
                          : 0
                      }
                      prefix="฿ "
                      thousandSeparator
                      decimalScale={2}
                    />
                  </div>
                </Card>
              ))}
            </div>
          </Card>
        </div>
      </Drawer>
      <Skeleton visible={getExpensesApi.isLoading}>
        <div className="flex flex-col gap-3">
          <div className="flex items-center justify-between">
            <Text c="dimmed">
              {getExpensesApi.data?.expenses.length} รายการ
            </Text>
            {isMember && (
              <Button
                onClick={openAddExpenseModal}
                leftSection={<IconPlus size={15} />}
              >
                สร้างรายจ่าย
              </Button>
            )}
          </div>
          <div className="flex flex-col gap-2">
            {getExpensesApi.data?.expenses.map((item, index) => (
              <Card
                key={index}
                withBorder
                onClick={() => {
                  setSetForAction(item);
                  openActionDrawer();
                }}
                className="flex flex-col hover:cursor-pointer"
              >
                <div className="flex justify-between">
                  <Text>{item.name}</Text>
                  <NumberFormatter
                    suffix=" บาท"
                    value={item.amount}
                    thousandSeparator
                  />
                </div>
                <Text c="dimmed" size="xs">
                  {item.owner.email}
                </Text>
              </Card>
            ))}
          </div>
        </div>
      </Skeleton>
    </>
  );
}
