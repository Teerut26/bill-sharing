import BackButton from "@/components/BackButton/BackButton";
import { api } from "@/utils/api";
import {
  Avatar,
  Button,
  Card,
  NumberFormatter,
  rem,
  Skeleton,
  Tabs,
  Text,
} from "@mantine/core";
import { IconCurrencyBaht, IconSettings, IconUsers } from "@tabler/icons-react";
import {
  type GetServerSidePropsContext,
  type InferGetServerSidePropsType,
} from "next";
import ExpensesPage from "@/components/Trip/ExpensesPage/ExpensesPage";
import { useSession } from "next-auth/react";
import { db } from "@/server/db";
import { getToken } from "next-auth/jwt";
import { env } from "@/env";
import MembersPage from "@/components/Trip/MembersPage/MembersPage";
import { modals } from "@mantine/modals";
import SettingPage from "@/components/Trip/SettingPage/SettingPage";

export default function Trip(
  props: InferGetServerSidePropsType<typeof getServerSideProps>,
) {
  const { data: session } = useSession();
  const getTripApi = api.tripRouter.getTrip.useQuery(props.id ?? "");
  const joinTripApi = api.tripRouter.joinTrip.useMutation();
  const iconStyle = { width: rem(12), height: rem(12) };
  const isMember = getTripApi.data?.members?.some(
    (member) => member.email === session?.user?.email,
  );

  const onReload = () => {
    void getTripApi.refetch();
  };

  return (
    <>
      {getTripApi.isLoading ? (
        <div className="flex flex-col gap-3">
          <BackButton label="กลับไปหน้ารายการทริป" />
          <Card className="flex flex-col gap-1">
            <Skeleton height={20} mt={6} width={100} />
            <div className="flex flex-col">
              <Skeleton height={20} mt={6} width={200} />
              <Skeleton height={10} mt={6} width={200} />
            </div>
          </Card>
          <Tabs defaultValue="expenses">
            <Tabs.List>
              <Tabs.Tab value="expenses">
                <Skeleton height={15} mt={6} width={50} />
              </Tabs.Tab>
            </Tabs.List>
          </Tabs>
        </div>
      ) : (
        <div className="flex flex-col gap-3">
          <BackButton label="กลับไปหน้ารายการทริป" />
          <Card>
            <div className="flex items-center justify-between">
              <div className="flex flex-col gap-1">
                <Text size="lg">{getTripApi.data?.name}</Text>
                <div className="flex flex-col">
                  <NumberFormatter
                    prefix="฿ "
                    value={getTripApi.data?.total_expense.toFixed(2)}
                    thousandSeparator
                    className="text-2xl font-bold"
                  />
                  <div className="flex items-center gap-1">
                    <Text c="dimmed" size="xs">
                      by
                    </Text>
                    <Avatar size={"xs"} src={getTripApi.data?.owner?.image} />
                    <Text c="dimmed" size="xs">
                      {getTripApi.data?.owner?.email}
                    </Text>
                  </div>
                </div>
              </div>
              {!isMember && (
                <div>
                  <Button
                    loading={joinTripApi.isPending}
                    onClick={() => {
                      modals.openConfirmModal({
                        title: "เข้าร่วมทริป",
                        children: (
                          <Text size="sm">
                            คุณต้องการเข้าร่วมทริปนี้ใช่หรือไม่
                          </Text>
                        ),
                        labels: { confirm: "เข้าร่วม", cancel: "ยกเลิก" },
                        onConfirm: () => {
                          if (!props.id) {
                            return;
                          }
                          joinTripApi.mutate(
                            { trip_id: props.id },
                            {
                              onSuccess: () => {
                                void getTripApi.refetch();
                              },
                            },
                          );
                        },
                      });
                    }}
                  >
                    เข้าร่วม
                  </Button>
                </div>
              )}
            </div>
          </Card>
          <Tabs defaultValue="expenses">
            <Tabs.List>
              <Tabs.Tab
                value="expenses"
                leftSection={<IconCurrencyBaht style={iconStyle} />}
              >
                รายจ่าย
              </Tabs.Tab>
              <Tabs.Tab
                value="stakeholders"
                leftSection={<IconUsers style={iconStyle} />}
              >
                สมาชิก
              </Tabs.Tab>
              {session?.user.email === getTripApi.data?.owner?.email && (
                <Tabs.Tab
                  value="settings"
                  leftSection={<IconSettings style={iconStyle} />}
                >
                  ตั้งค่า
                </Tabs.Tab>
              )}
            </Tabs.List>

            <Tabs.Panel value="expenses" pt="xs">
              <ExpensesPage onReload={onReload} trip_id={props.id!} />
            </Tabs.Panel>
            <Tabs.Panel value="stakeholders" pt="xs">
              <MembersPage onReload={onReload} trip_id={props.id!} />
            </Tabs.Panel>
            <Tabs.Panel value="settings" pt="xs">
              <SettingPage onReload={onReload} trip_id={props.id!} />
            </Tabs.Panel>
          </Tabs>
        </div>
      )}
    </>
  );
}

export async function getServerSideProps(context: GetServerSidePropsContext) {
  const token = await getToken({ req: context.req });
  const trip = await db.trip.findUnique({
    where: {
      id: context.query.id?.toString(),
    },
    include: {
      members: true,
    },
  });
  if (trip?.password) {
    if (!trip.members.some((member) => member.email === token?.email)) {
      return {
        redirect: {
          destination: `/trip/password/${context.query.id?.toString()}?callbackUrl=${encodeURIComponent(`${env.NEXTAUTH_URL}/trip/${context.query.id?.toString()}`)}`,
          permanent: false,
        },
      };
    }
  }

  return {
    props: {
      id: context.query.id?.toString(),
    },
  };
}
