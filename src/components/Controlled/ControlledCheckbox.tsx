import {
  type FieldValues,
  type Path,
  type Control,
  Controller,
} from "react-hook-form";
import { Checkbox, type CheckboxProps } from "@mantine/core";
import React from "react";

interface ControlledCheckboxProps<T extends FieldValues> {
  control: Control<T>;
  name: Path<T>;
  props?: CheckboxProps;
}

const ControlledCheckbox = <T extends FieldValues>(
  props: ControlledCheckboxProps<T>,
) => {
  return (
    <Controller
      rules={{ required: true }}
      name={props.name}
      control={props.control}
      render={({ field: { onChange, value, ref }, fieldState: { error } }) => {
        return (
          <>
            <Checkbox
              error={error ? error.message : undefined}
              {...props.props}
              ref={ref}
              value={value}
              onChange={onChange}
              className="w-full"
            />
          </>
        );
      }}
    />
  );
};

export default ControlledCheckbox;
