import BackButton from "@/components/BackButton/BackButton";
import { db } from "@/server/db";
import { api } from "@/utils/api";
import { Avatar, Button, PasswordInput, Text } from "@mantine/core";
import { notifications } from "@mantine/notifications";
import {
  type GetServerSidePropsContext,
  type InferGetServerSidePropsType,
} from "next";
import { useRef } from "react";

export default function Password(
  props: InferGetServerSidePropsType<typeof getServerSideProps>,
) {
  const authorizeTripApi = api.tripRouter.authorizeTrip.useMutation();

  const passwordRef = useRef<HTMLInputElement>(null);
  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!passwordRef.current?.value) {
      notifications.show({
        title: "ผิดพลาด",
        message: "กรุณากรอกรหัสผ่าน",
        color: "red",
      });
      return;
    }

    if (!props.id) {
      notifications.show({
        title: "ผิดพลาด",
        message: "ไม่พบรหัสทริป",
        color: "red",
      });
      return;
    }

    const keyNotification = notifications.show({
      title: "กําลังเข้าสู่ระบบ",
      message: "กรุณารอสักครู่",
      loading: true,
      autoClose: false,
    });
    authorizeTripApi.mutate(
      {
        trip_id: props.id,
        password: passwordRef.current?.value,
      },
      {
        onSuccess: () => {
          notifications.update({
            id: keyNotification,
            color: "green",
            title: "เข้าสู่ระบบสําเร็จ",
            message: "เข้าสู่ระบบสำเร็จแล้ว",
            loading: false,
            autoClose: 3000,
          });
          if (props.callbackUrl) {
            window.location.href = props.callbackUrl;
          }
        },
        onError: (error) => {
          notifications.update({
            id: keyNotification,
            color: "red",
            title: "เข้าสู่ระบบไม่สําเร็จ",
            message: error.message,
            loading: false,
            autoClose: 3000,
          });
        },
      },
    );
  };

  return (
    <div className="flex flex-col gap-2">
      <BackButton label="กลับไปหน้ารายการทริป" href={`/trip`} />
      <div className="flex flex-col gap-1">
        <div>{props.trip?.name}</div>
        <div className="flex items-center gap-1">
          <Text c="dimmed" size="xs">
            by
          </Text>
          <Avatar size={"xs"} src={props.trip?.owner.image} />
          <Text c="dimmed" size="xs">
            {props.trip?.owner.email}
          </Text>
        </div>
      </div>
      <form className="flex flex-col gap-2" onSubmit={handleSubmit}>
        <PasswordInput
          ref={passwordRef}
          name="password"
          placeholder="รหัสผ่าน"
        />
        <Button type="submit">บันทึก</Button>
      </form>
    </div>
  );
}

export async function getServerSideProps(context: GetServerSidePropsContext) {
  const trip = await db.trip.findUnique({
    where: {
      id: context.query.id?.toString(),
    },
    select: {
      name: true,
      owner: {
        select: {
          email: true,
          image: true,
        },
      },
    },
  });
  return {
    props: {
      id: context.query.id?.toString(),
      callbackUrl: context.query.callbackUrl?.toString(),
      trip: trip,
    },
  };
}
