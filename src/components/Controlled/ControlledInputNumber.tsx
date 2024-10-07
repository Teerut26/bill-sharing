import {
  type FieldValues,
  type Path,
  type Control,
  Controller,
} from "react-hook-form";
import { NumberInput, type NumberInputProps } from "@mantine/core";
import React from "react";

interface ControlledInputNumberProps<T extends FieldValues> {
  control: Control<T>;
  name: Path<T>;
  props?: NumberInputProps;
}

const ControlledInputNumber = <T extends FieldValues>(
  props: ControlledInputNumberProps<T>,
) => {
  return (
    <Controller
      rules={{ required: true }}
      name={props.name}
      control={props.control}
      render={({ field: { onChange, value, ref }, fieldState: { error } }) => {
        const onChangeValue = (value: number | string) => {
          if (value === "" || value === null || value === undefined) {
            onChange(null);
          } else {
            onChange(value);
          }
        };

        return (
          <>
            <NumberInput
              error={error ? error.message : undefined}
              onWheel={(e) => e.currentTarget.blur()}
              ref={ref}
              {...props.props}
              value={value}
              onChange={onChangeValue}
              className="w-full"
            />
          </>
        );
      }}
    />
  );
};

export default ControlledInputNumber;
