import {
  type FieldValues,
  type Path,
  type Control,
  Controller,
} from "react-hook-form";
import { Select, type SelectProps } from "@mantine/core";
import clsx from "clsx";

interface ControlledSelectProps<T extends FieldValues> {
  control: Control<T>;
  name: Path<T>;
  className?: string;
  props?: SelectProps;
}

const ControlledSelect = <T extends FieldValues>(
  props: ControlledSelectProps<T>,
) => {
  return (
    <Controller
      rules={{ required: true }}
      name={props.name}
      control={props.control}
      render={({ field: { onChange, value }, fieldState: { error } }) => {
        return (
          <Select
            className={clsx(props.className)}
            error={error?.message}
            onChange={onChange}
            value={value}
            {...props.props}
          />
        );
      }}
    />
  );
};

export default ControlledSelect;
