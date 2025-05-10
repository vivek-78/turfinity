import React from "react";

import { type Path } from "react-hook-form";

import { Checkbox } from "~/components/ui/checkbox";
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "~/components/ui/form";

import { cn } from "~/lib/utils";

import type { Control, FieldValues } from "react-hook-form";

interface FormCheckBoxInterface<T extends FieldValues> {
  control: Control<T>;
  name: Path<T>;
  label?: string;
  className?: string;
  disable?: boolean;
  onChange?: () => void;
}
const FormCheckBox = <T extends FieldValues>({
  control,
  name,
  label,
  className,
  disable,
  onChange
}: FormCheckBoxInterface<T>) => {
  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => {
        return (
          <FormItem className={cn("flex w-full items-center space-y-0", className)}>
            <FormControl>
              <Checkbox
                checked={field.value}
                onCheckedChange={(value) => {
                  field.onChange(value);
                  onChange?.();
                }}
                disabled={disable}
              />
            </FormControl>
            {label && <FormLabel className="y-0 ml-2">{label}</FormLabel>}
            <FormMessage />
          </FormItem>
        );
      }}
    />
  );
};

export default FormCheckBox;
