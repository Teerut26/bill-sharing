import { api } from "@/utils/api";
import { Button, Text } from "@mantine/core";
import { modals } from "@mantine/modals";
import { notifications } from "@mantine/notifications";
import { useRouter } from "next/navigation";

interface Props {
  trip_id: string;
  onReload?: () => void;
}

export default function SettingPage(props: Props) {
  const navigate = useRouter();
  const deleteTrip = api.tripRouter.deleteTrip.useMutation();

  const onDeleteTrip = () => {
    modals.openConfirmModal({
      title: "ลบทริป",
      centered: true,
      children: <Text size="sm">คุณต้องการลบทริปนี้หรือไม่?</Text>,
      labels: {
        confirm: "ยืนยัน",
        cancel: "ยกเลิก",
      },
      confirmProps: { color: "red" },
      onConfirm: () => {
        if (!props.trip_id) {
          return;
        }
        const ketNotification = notifications.show({
          title: "กําลังลบทริป",
          message: "กรุณารอสักครู่",
          loading: true,
          autoClose: false,
          withCloseButton: false,
        });
        deleteTrip.mutate(
          {
            trip_id: props.trip_id,
          },
          {
            onSuccess: () => {
              notifications.update({
                id: ketNotification,
                color: "green",
                title: "ลบทริปสำเร็จ",
                message: "ลบทริปสำเร็จแล้ว",
                loading: false,
                autoClose: 3000,
              });
              navigate.push("/trip");
            },
            onError: (error) => {
              notifications.update({
                id: ketNotification,
                color: "red",
                title: "ลบทริปไม่สําเร็จ",
                message: error.message,
                loading: false,
                autoClose: 3000,
              });
            },
          },
        );
      },
    });
  };

  return (
    <div className="flex flex-col gap-3">
      <Button variant="filled" onClick={onDeleteTrip} color="red">
        ลบทริป
      </Button>
    </div>
  );
}
