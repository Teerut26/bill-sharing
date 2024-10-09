import BackButton from "@/components/BackButton/BackButton";
import ControlledDatePicker from "@/components/Controlled/ControlledDatePicker";
import ControlledInputText from "@/components/Controlled/ControlledInputText";
import {
  createTripSchema,
  type CreateTripSchemaType,
} from "@/schemas/create-trip.schema";
import { api } from "@/utils/api";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@mantine/core";
import { notifications } from "@mantine/notifications";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";

export default function Index() {
  const navigate = useRouter();
  const createTrip = api.tripRouter.createTrip.useMutation();
  const {
    control,
    setValue,
    handleSubmit,
    formState: { errors },
  } = useForm<CreateTripSchemaType>({
    resolver: zodResolver(createTripSchema),
  });

  return (
    <div className="flex flex-col gap-3">
      <BackButton label="กลับไปหน้ารายการทริป" />
      <form
        className="flex flex-col gap-5"
        onSubmit={handleSubmit((d) => {
          const keyNotification = notifications.show({
            title: "กําลังสร้างทริป",
            loading: true,
            autoClose: false,
            disallowClose: true,
            message: "กรุณารอสักครู่...",
          });
          createTrip.mutate(d, {
            onSuccess: () => {
              notifications.update({
                color: "green",
                title: "สร้างทริปสําเร็จ",
                message: "ทริปของคุณถูกสร้างเรียบร้อยแล้ว",
                loading: false,
                autoClose: 3000,
                id: keyNotification,
              });
              navigate.push("/trip");
            },
            onError: (error) => {
              notifications.update({
                color: "red",
                title: "สร้างทริปไม่สําเร็จ",
                message: error.message,
                loading: false,
                autoClose: 3000,
                id: keyNotification,
              });
            },
          });
        })}
      >
        <ControlledInputText
          control={control}
          name="name"
          props={{
            size: "md",
            placeholder: "กรอกชื่อทริป",
            label: "ชื่อทริป",
            required: true,
          }}
        />
        <ControlledInputText
          control={control}
          name="location"
          props={{
            size: "md",
            placeholder: "กรอกสถานที่ทริป",
            label: "สถานที่ทริป",
          }}
        />
        <ControlledDatePicker
          label="วันที่เริ่ม"
          placeholder="เลือกวันที่เริ่ม"
          clearable
          size="md"
          control={control}
          name="start_date"
        />
        <ControlledDatePicker
          label="วันที่สิ้นสุด"
          placeholder="เลือกวันที่สิ้นสุด"
          clearable
          size="md"
          control={control}
          name="end_date"
        />
        <ControlledInputText
          control={control}
          name="password"
          props={{
            size: "md",
            placeholder: "กรอกรหัสผ่าน",
            label: "รหัสผ่าน",
          }}
        />
        <Button size="md" type="submit">
          บันทึก
        </Button>
      </form>
    </div>
  );
}
