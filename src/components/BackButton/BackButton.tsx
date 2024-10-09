import { Text, UnstyledButton } from "@mantine/core";
import { IconArrowLeft } from "@tabler/icons-react";
import { useRouter } from "next/navigation";

export default function BackButton({ label, href }: { label?: string, href?: string }) {
  const router = useRouter();
  return (
    <UnstyledButton
      className="w-fit"
      variant="transparent"
      size="compact-xs"
      c={"dimmed"}
      onClick={() => href ? router.push(href) : router.back()}
    >
      <div className="flex items-center gap-1">
        <IconArrowLeft size={20} />
        {label && <Text size="md">{label}</Text>}
      </div>
    </UnstyledButton>
  );
}
