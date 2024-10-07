import { Button, Card, Text } from "@mantine/core";
import { IconBrandGoogleFilled } from "@tabler/icons-react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/router";

export default function SignIn() {
  const { query } = useRouter();
  return (
    <div className="flex h-screen w-screen items-center justify-center">
      <Card withBorder className="flex flex-col gap-2" maw={400} w={"100%"}>
        <Text size="lg" fw={"bold"}>
          เข้าสูระบบ
        </Text>

        <Button
          leftSection={<IconBrandGoogleFilled size={14} />}
          variant="filled"
          color="#4888F4"
          onClick={() =>
            signIn("google", { callbackUrl: query.callbackUrl?.toString() })
          }
        >
          เข้าสู่ระบบด้วย Google
        </Button>
      </Card>
    </div>
  );
}
