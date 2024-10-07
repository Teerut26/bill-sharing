import {
  type FieldValues,
  type Path,
  type Control,
  Controller,
} from "react-hook-form";
import { TextInput, type TextInputProps } from "@mantine/core";
import React from "react";

interface ControlledInputTextProps<T extends FieldValues> {
  control: Control<T>;
  name: Path<T>;
  props?: TextInputProps;
}

const ControlledInputText = <T extends FieldValues>(
  props: ControlledInputTextProps<T>,
) => {
  return (
    <Controller
      rules={{ required: true }}
      name={props.name}
      control={props.control}
      render={({ field: { onChange, value, ref }, fieldState: { error } }) => {
        const onChangeValue = (value: string) => {
          if (value === "" || value === null || value === undefined) {
            onChange(undefined);
          } else {
            onChange(value);
          }
        };

        return (
          <>
            <TextInput
              error={error ? error.message : undefined}
              onWheel={(e) => e.currentTarget.blur()}
              {...props.props}
              ref={ref}
              value={value}
              onChange={(e) => onChangeValue(e.target.value)}
              className="w-full"
            />
          </>
        );
      }}
    />
  );
};

export default ControlledInputText;
