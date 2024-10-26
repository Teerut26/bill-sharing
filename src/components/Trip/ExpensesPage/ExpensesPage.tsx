import { api } from "@/utils/api";
import {
  ActionIcon,
  Avatar,
  Badge,
  Button,
  Card,
  Drawer,
  Modal,
  NumberFormatter,
  Skeleton,
  Text,
} from "@mantine/core";
import { format, formatDistance, setDefaultOptions } from "date-fns";
import { useDisclosure, useMediaQuery } from "@mantine/hooks";
import { modals } from "@mantine/modals";
import { notifications } from "@mantine/notifications";
import { IconCheck, IconPlus, IconX } from "@tabler/icons-react";
import { useSession } from "next-auth/react";
import { useState } from "react";
import { th } from "date-fns/locale";
setDefaultOptions({ locale: th });
import ExpensesForm from "./ExpensesForm/ExpensesForm";
import _ from "lodash";

interface Props {
  trip_id: string;
  onReload?: () => void;
}

export default function ExpensesPage(props: Props) {
  const { data: session } = useSession();
  const getTripApi = api.tripRouter.getTrip.useQuery(props.trip_id ?? "");
  const isMobile = useMediaQuery("(max-width: 768px)");
  const deleteExpenseApi = api.tripRouter.deleteExpense.useMutation();
  const createExpenseApi = api.tripRouter.createExpense.useMutation();
  const editExpenseApi = api.expenseRouter.editExpense.useMutation();
  const paidExpenseApi = api.expenseRouter.paidExpense.useMutation();
  const unPaidExpenseApi = api.expenseRouter.unPaidExpense.useMutation();
  const getExpensesApi = api.tripRouter.getExpenses.useQuery({
    trip_id: props.trip_id ?? "",
  });

  const [
    openedActionDrawer,
    { open: openActionDrawer, close: closeActionDrawer },
  ] = useDisclosure(false);
  const [
    openedAddExpenseModal,
    { open: openAddExpenseModal, close: closeAddExpenseModal },
  ] = useDisclosure(false);
  const [
    openedEditExpenseModal,
    { open: openEditExpenseModal, close: closeEditExpenseModal },
  ] = useDisclosure(false);

  type ExpenseType = NonNullable<
    typeof getExpensesApi.data
  >["expenses"] extends (infer T)[] | null | undefined
    ? T
    : never;
  const [SetForAction, setSetForAction] = useState<ExpenseType>();

  const getExpenseApi = api.tripRouter.getExpense.useQuery({
    expense_id: SetForAction?.id ?? "",
  });

  const isMember = getTripApi.data?.members?.some(
    (member) => member.email === session?.user?.email,
  );

  const isOwner = getTripApi.data?.owner?.email === session?.user?.email;

  const onReload = () => {
    props.onReload?.();
    void getTripApi.refetch();
    void getExpenseApi.refetch();
    void getExpensesApi.refetch();
  };

  type PaidPayload = NonNullable<
    typeof getExpenseApi.data
  >["expense_stakeholder"] extends (infer T)[] | null | undefined
    ? T
    : never;

  const isPaid = (expense_stakeholder: PaidPayload) => {
    modals.openConfirmModal({
      title: "ตรวจสอบว่าจ่ายแล้ว",
      centered: true,
      children: (
        <Text size="sm">
          คุณต้องการตรวจว่าจ่ายแล้วหรือไม่{" "}
          <Badge variant="gradient">
            {expense_stakeholder.stakeholder.email}{" "}
            {expense_stakeholder.percentage}%{" "}
            <NumberFormatter
              className="font-bold"
              value={(SetForAction?.amount
                ? (expense_stakeholder.percentage / 100) * SetForAction.amount
                : 0
              ).toFixed(2)}
              prefix="฿ "
              thousandSeparator
              decimalScale={2}
            />
          </Badge>{" "}
          ใช่หรือไม่
        </Text>
      ),
      labels: { confirm: "จ่ายแล้ว", cancel: "ยกเลิก" },
      confirmProps: { color: "green" },
      onConfirm: () => {
        const keyNotification = notifications.show({
          title: "ตรวจสอบค่าใช้จ่าย",
          message: "กำลังตรวจสอบค่าใช้จ่าย",
          color: "blue",
          loading: true,
          autoClose: false,
        });

        paidExpenseApi.mutate(
          {
            expenseId: expense_stakeholder.expenseId,
            stakeholderId: expense_stakeholder.stakeholderId,
          },
          {
            onSuccess: () => {
              notifications.update({
                id: keyNotification,
                color: "green",
                title: "ตรวจสอบค่าใช้จ่ายสำเร็จ",
                message: "ตรวจสอบค่าใช้จ่ายสำเร็จ",
                loading: false,
                icon: <IconCheck />,
                autoClose: 2000,
              });
              onReload();
            },
            onError: (error) => {
              notifications.update({
                id: keyNotification,
                color: "red",
                title: "ตรวจสอบค่าใช้จ่ายไม่สำเร็จ",
                message: error.message,
                icon: <IconCheck />,
                loading: false,
                autoClose: 2000,
              });
            },
          },
        );
      },
    });
  };

  const onUnPaid = (expense_stakeholder: PaidPayload) => {
    modals.openConfirmModal({
      title: "ตรวจสอบว่ายังไม่ได้จ่าย",
      centered: true,
      children: (
        <Text size="sm">
          คุณต้องการตรวจสอบว่ายังไม่ได้จ่ายหรือไม่{" "}
          <Badge variant="gradient">
            {expense_stakeholder.stakeholder.email}{" "}
            {expense_stakeholder.percentage}%{" "}
            <NumberFormatter
              className="font-bold"
              value={(SetForAction?.amount
                ? (expense_stakeholder.percentage / 100) * SetForAction.amount
                : 0
              ).toFixed(2)}
              prefix="฿ "
              thousandSeparator
              decimalScale={2}
            />
          </Badge>{" "}
          ใช่หรือไม่
        </Text>
      ),
      labels: { confirm: "ยังไม่ได้จ่ายแล้ว", cancel: "ยกเลิก" },
      confirmProps: { color: "red" },
      onConfirm: () => {
        const keyNotification = notifications.show({
          title: "ตรวจสอบว่ายังไม่ได้จ่าย",
          message: "กำลังตรวจสอบว่ายังไม่ได้จ่าย",
          color: "blue",
          loading: true,
          autoClose: false,
        });

        unPaidExpenseApi.mutate(
          {
            expenseId: expense_stakeholder.expenseId,
            stakeholderId: expense_stakeholder.stakeholderId,
          },
          {
            onSuccess: () => {
              notifications.update({
                id: keyNotification,
                color: "green",
                title: "ตรวจสอบค่าใช้จ่ายสำเร็จ",
                message: "ตรวจสอบค่าใช้จ่ายสำเร็จ",
                loading: false,
                icon: <IconCheck />,
                autoClose: 2000,
              });
              onReload();
            },
            onError: (error) => {
              notifications.update({
                id: keyNotification,
                color: "red",
                title: "ตรวจสอบค่าใช้จ่ายไม่สำเร็จ",
                message: error.message,
                icon: <IconCheck />,
                loading: false,
                autoClose: 2000,
              });
            },
          },
        );
      },
    });
  };

  return (
    <>
      <Modal
        fullScreen={isMobile}
        size="70%"
        opened={openedEditExpenseModal}
        onClose={closeEditExpenseModal}
        title="แก้ไขค่าใช้จ่าย"
      >
        <ExpensesForm
          mode="edit"
          onFinish={(d) => {
            if (!getExpenseApi.data?.id) {
              return;
            }

            const keyNotification = notifications.show({
              title: "แก้ไขค่าใช้จ่าย",
              message: "กําลังแก้ไขค่าใช้จ่าย",
              color: "blue",
              loading: true,
              autoClose: false,
            });

            editExpenseApi.mutate(
              {
                ...d,
                expense_id: getExpenseApi.data?.id ?? "",
              },
              {
                onSuccess: () => {
                  notifications.update({
                    id: keyNotification,
                    color: "green",
                    title: "แก้ไขค่าใช้จ่ายสำเร็จ",
                    message: "แก้ไขค่าใช้จ่ายสำเร็จแล้ว",
                    loading: false,
                    autoClose: 3000,
                    disallowClose: true,
                  });
                  closeEditExpenseModal();
                  onReload();
                },
                onError: () => {
                  notifications.update({
                    id: keyNotification,
                    color: "red",
                    title: "แก้ไขค่าใช้จ่ายไม่สำเร็จ",
                    message: "แก้ไขค่าใช้จ่ายไม่สำเร็จ",
                    loading: false,
                    autoClose: 3000,
                    disallowClose: true,
                  });
                },
              },
            );
          }}
          data={getExpenseApi.data}
          members={getTripApi.data?.members ?? []}
        />
      </Modal>
      <Modal
        fullScreen={isMobile}
        size="70%"
        opened={openedAddExpenseModal}
        onClose={closeAddExpenseModal}
        title="เพิ่มค่าใช้จ่าย"
      >
        <ExpensesForm
          mode="create"
          members={getTripApi.data?.members ?? []}
          onFinish={(d) => {
            const keyNotification = notifications.show({
              title: "เพิ่มค่าใช้จ่าย",
              message: "กําลังเพิ่มค่าใช้จ่าย",
              color: "blue",
              loading: true,
              autoClose: false,
            });
            createExpenseApi.mutate(
              {
                ...d,
                trip_id: props.trip_id ?? "",
              },
              {
                onSuccess: () => {
                  notifications.update({
                    id: keyNotification,
                    color: "green",
                    title: "เพิ่มค่าใช้จ่ายสำเร็จ",
                    message: "เพิ่มค่าใช้จ่ายสำเร็จแล้ว",
                    loading: false,
                    autoClose: 3000,
                  });
                  onReload();
                  closeAddExpenseModal();
                },
                onError: (error) => {
                  notifications.update({
                    id: keyNotification,
                    color: "red",
                    title: "เพิ่มค่าใช้จ่ายไม่สําเร็จ",
                    message: error.message,
                    loading: false,
                    autoClose: 3000,
                  });
                },
              },
            );
          }}
        />
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
              <Button
                onClick={() => {
                  closeActionDrawer();
                  openEditExpenseModal();
                }}
              >
                แก้ไข
              </Button>
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
                            onReload();
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
                  <div className="flex items-center justify-between">
                    <div className="flex flex-col">
                      <div className="flex items-center gap-2">
                        <Avatar size={"xs"} src={item.stakeholder.image} />
                        <Text>{item.stakeholder.email}</Text>
                      </div>
                      <div className="flex items-center gap-2">
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
                        <Badge variant="gradient">
                          {item.percentage.toFixed(2)}%
                        </Badge>

                        {item.paid ? (
                          <Badge color="green">จ่ายแล้ว</Badge>
                        ) : (
                          <Badge color="red">ยังไม่จ่าย</Badge>
                        )}
                      </div>
                    </div>
                    {isOwner && (
                      <>
                        {item.paid ? (
                          <ActionIcon
                            onClick={() => {
                              onUnPaid(item);
                            }}
                            color="red"
                          >
                            <IconX />
                          </ActionIcon>
                        ) : (
                          <ActionIcon
                            onClick={() => {
                              isPaid(item);
                            }}
                            color="green"
                          >
                            <IconCheck />
                          </ActionIcon>
                        )}
                      </>
                    )}
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
                  <div className="flex">
                    <NumberFormatter
                      value={_.sumBy(
                        item.expense_stakeholder.filter((v) => v.paid),
                        (v) => {
                          return (v.percentage / 100) * item.amount;
                        },
                      ).toFixed(2)}
                      thousandSeparator
                    />
                    /
                    <NumberFormatter
                      value={item.amount.toFixed(2)}
                      thousandSeparator
                    />
                  </div>
                </div>
                <div className="flex gap-3">
                  <Text c="dimmed" size="xs" className="flex gap-1">
                    <div>{format(item.createdAt, "dd/MM/yyyy HH:mm:ss")}</div>
                    <div>
                      (
                      {formatDistance(item.createdAt, new Date(), {
                        addSuffix: true,
                      })}
                      )
                    </div>
                  </Text>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </Skeleton>
    </>
  );
}
