import { api } from "@/utils/api";
import {
  Avatar,
  Card,
  Skeleton,
} from "@mantine/core";

interface Props {
  trip_id: string;
  onReload?: () => void;
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
