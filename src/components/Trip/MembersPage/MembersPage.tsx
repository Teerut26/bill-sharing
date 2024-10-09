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
  Button,
  Card,
  Chip,
  Drawer,
  Modal,
  NumberFormatter,
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

export default function MembersPage(props: Props) {
  const getMembersFromTrip = api.tripRouter.getMembersFromTrip.useQuery({
    trip_id: props.trip_id ?? "",
  });

  return (
    <>
      <Skeleton visible={getMembersFromTrip.isLoading}>
        <div className="flex flex-col gap-3">
          {getMembersFromTrip.data?.map((member, index) => (
            <Card withBorder key={index}>
              <div className="flex items-center gap-2">
                <Avatar size={"md"} src={member.image} />
                <div>
                    {member.email}
                </div>
              </div>
            </Card>
          ))}
        </div>
      </Skeleton>
    </>
  );
}
