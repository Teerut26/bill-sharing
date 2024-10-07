import {
  type FieldValues,
  type Path,
  type Control,
  Controller,
} from "react-hook-form";
import { MantineSize, type ComboboxData } from "@mantine/core";
import {
  DatesProvider,
  DateTimePicker,
  type DatesRangeValue,
  type DateValue,
} from "@mantine/dates";
import "dayjs/locale/th";
import { IconCalendar } from "@tabler/icons-react";

interface ControlledDateTimePickerProps<T extends FieldValues> {
  control: Control<T>;
  name: Path<T>;
  className?: string;
  label?: string;
  description?: string;
  placeholder?: string;
  option?: ComboboxData;
  disabled?: boolean;
  required?: boolean;
  clearable?: boolean;
  prefixSectionWidth?: number;
  suffixSectionWidth?: number;
  prefix?: React.ReactNode;
  suffix?: React.ReactNode;
  size?: MantineSize
}

const ControlledDateTimePicker = <T extends FieldValues>(
  props: ControlledDateTimePickerProps<T>,
) => {
  return (
    <Controller
      rules={{ required: true }}
      name={props.name}
      control={props.control}
      render={({ field: { onChange, value }, fieldState: { error } }) => {
        const handleOnChange = (date: DateValue | DatesRangeValue | Date[]) => {
          onChange(date);
        };
        return (
          <DatesProvider
            settings={{
              locale: "th",
              timezone: "Asia/Bangkok",
            }}
          >
            <DateTimePicker
              withAsterisk={props.required}
              valueFormat="วันddddที่ DD MMMM YYYY HH:mm"
              error={error ? error.message : undefined}
              disabled={props.disabled}
              placeholder={props.placeholder}
              label={props.label}
              value={value}
              size={props.size}
              onChange={handleOnChange}
              leftSectionWidth={props.prefixSectionWidth}
              rightSectionWidth={props.suffixSectionWidth}
              rightSection={
                (props.prefix ? <IconCalendar size={15} /> : undefined) ?? (
                  <IconCalendar size={15} />
                )
              }
              leftSection={
                props.prefix && (
                  <div className="whitespace-nowrap">{props.prefix}</div>
                )
              }
              className={props.className}
              clearable={props.clearable}
            />
          </DatesProvider>
        );
      }}
    />
  );
};

export default ControlledDateTimePicker;
