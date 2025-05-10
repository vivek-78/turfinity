import React from "react";

import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "~/components/ui/form";
import { PhoneInput } from "~/components/ui/phone-input";

import { cn } from "~/lib/utils";

import type { Control, FieldValues, Path } from "react-hook-form";

interface InputFieldProps<T extends FieldValues> {
  control: Control<T>;
  name: Path<T>;
  label?: string;
  value?: string;
  placeholder: string;
  className?: string;
  required?: boolean;
  type?: string;
  testId?: string;
  maxLength?: number;
  min?: number;
  max?: number;
  step?: number;
  disabled?: boolean;
  onChange?: () => void;
  leftIcon?: string;
  rightIcon?: string;
}
const PhoneInputField = <T extends FieldValues>({
  control,
  name,
  label,
  maxLength,
  placeholder,
  className,
  required
}: InputFieldProps<T>) => {
  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => {
        return (
          <FormItem className={cn(className)}>
            <FormLabel>
              {label}
              {required && <span className="ml-1 text-red-600">*</span>}
            </FormLabel>
            <FormControl>
              <div className="relative">
                <PhoneInput maxLength={maxLength} placeholder={placeholder} {...field} />
              </div>
            </FormControl>
            <FormMessage />
          </FormItem>
        );
      }}
    />
  );
};

export default PhoneInputField;
