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
        {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map((item, index) => (
          <Card
            key={index}
            withBorder
            className="flex flex-col gap-1 hover:cursor-pointer"
          >
            <Text size="lg">เกราะล้าน</Text>
            <div className="flex items-center justify-between md:flex-col-reverse md:items-start md:gap-2">
              <Avatar.Group>
                <Avatar size={"md"} src="image.png" />
                <Avatar src="image.png" />
                <Avatar src="image.png" />
                <Avatar>+5</Avatar>
              </Avatar.Group>
              <NumberFormatter
                suffix=" บาท"
                value={1000000}
                thousandSeparator
              />
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
