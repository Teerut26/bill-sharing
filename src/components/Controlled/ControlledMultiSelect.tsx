import {
  type FieldValues,
  type Path,
  type Control,
  Controller,
} from "react-hook-form";
import {
  type ComboboxData,
  MultiSelect,
  MultiSelectProps,
} from "@mantine/core";
import React from "react";

interface ControlledMultiSelectProps<T extends FieldValues> {
  control: Control<T>;
  name: Path<T>;
  props?: MultiSelectProps;
}

const ControlledMultiSelect = <T extends FieldValues>(
  props: ControlledMultiSelectProps<T>,
) => {
  return (
    <Controller
      rules={{ required: true }}
      name={props.name}
      control={props.control}
      render={({ field: { onChange, value, ref }, fieldState: { error } }) => {
        return (
          <>
            <MultiSelect
              error={error?.message}
              onChange={onChange}
              value={value}
              {...props.props}
              className="w-full"
            />
          </>
        );
      }}
    />
  );
};

export default ControlledMultiSelect;
