import { api } from "@/utils/api";
import {
  Avatar,
  Button,
  Card,
  NumberFormatter,
  Text,
  TextInput,
} from "@mantine/core";
import { IconPlus } from "@tabler/icons-react";
import Link from "next/link";

export default function Index() {
  const getTripsApi = api.tripRouter.getTrips.useQuery();
  return (
    <div className="flex flex-col gap-5">
      <div className="flex justify-between gap-3">
        <TextInput size="lg" placeholder="ค้นหา" maw={400} w="100%" />
        <Link href="/trip/add">
          <Button leftSection={<IconPlus />} size="lg">
            เพิ่มทริป
          </Button>
        </Link>
      </div>
      <div className="grid grid-cols-1 gap-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
        {getTripsApi.data?.map((item, index) => (
          <Link href={`/trip/${item.id}`} key={index}>
            <Card
              withBorder
              className="flex flex-col gap-1 hover:cursor-pointer"
            >
              <Text size="lg">{item.name}</Text>
              <div className="flex items-center justify-between md:flex-col-reverse md:items-start md:gap-2">
                {item.members ? <Avatar.Group>
                  {item.members.slice(0, 3).map((member, index) => (
                    <Avatar key={index} size={"md"} src={member.image} />
                  ))}
                  {item.members.length > 3 && (
                    <Avatar>{item.members.length - 3}</Avatar>
                  )}
                </Avatar.Group> : <Avatar></Avatar>}
                {!item.password ? (
                  <NumberFormatter
                    suffix=" บาท"
                    value={item.total_expense ?? 0}
                    thousandSeparator
                  />
                ) : (
                  <Text>**** บาท</Text>
                )}
              </div>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
}
