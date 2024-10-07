import BackButton from "@/components/BackButton/BackButton";
import ControlledInputText from "@/components/Controlled/ControlledInputText";
import {
  createTripSchema,
  type CreateTripSchemaType,
} from "@/schemas/create-trip.schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

export default function Index() {
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
        onSubmit={handleSubmit((d) => console.log(d))}
      >
        <ControlledInputText
          control={control}
          name="name"
          props={{
            size: "md",
            placeholder: "ชื่อทริป",
            label: "ชื่อทริป",
            required: true,
          }}
        />
      </form>
    </div>
  );
}
