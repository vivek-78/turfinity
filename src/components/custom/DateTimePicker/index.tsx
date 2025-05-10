import { useState } from "react";

import { CalendarIcon } from "@radix-ui/react-icons";
import { format } from "date-fns";
import { useFormContext } from "react-hook-form";

import { Button } from "~/components/ui/button";
import { Calendar } from "~/components/ui/calendar";
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "~/components/ui/form";
import { Popover, PopoverContent, PopoverTrigger } from "~/components/ui/popover";
import { ScrollArea } from "~/components/ui/scroll-area";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "~/components/ui/select";

import { cn } from "~/lib/utils";

import "react-day-picker/dist/style.css";

import type { FieldValues, Path } from "react-hook-form";

// Component Props for Reusability
interface DatetimePickerProps<T extends FieldValues> {
  name: Path<T>; // field name
  label?: string; // label text
  onTimeSelect?: () => void;
  required?: boolean;
  className?: string;
  disabled?: boolean;
}

export function DatetimePicker<T extends FieldValues>({
  name,
  label,
  onTimeSelect,
  required,
  className,
  disabled = false
}: DatetimePickerProps<T>) {
  const form = useFormContext<T>(); // Access form context
  const [isOpen, setIsOpen] = useState(false);
  const [time, setTime] = useState<string>("00:00");
  const [date, setDate] = useState<Date | null>(new Date()); // Set null by default

  function formatTimeTo12Hour(hour: number, minute: number): string {
    const period = hour >= 12 ? "PM" : "AM";
    const hour12 = hour % 12 || 12; // Convert to 12-hour format and handle midnight (0)
    const minuteStr = minute.toString().padStart(2, "0");
    return `${hour12}:${minuteStr} ${period}`;
  }

  return (
    <FormField
      control={form.control}
      name={name}
      render={({ field }) => (
        <FormItem>
          <FormLabel>
            {label}
            {required && <span className="ml-1 text-red-600">*</span>}
          </FormLabel>
          <Popover open={isOpen} onOpenChange={setIsOpen}>
            <PopoverTrigger asChild>
              <FormControl>
                <Button
                  variant={"outline"}
                  disabled={disabled}
                  className={cn(
                    "w-full px-2 font-normal",
                    !field.value && "text-muted-foreground",
                    className
                  )}>
                  {field.value ? (
                    `${format(field.value, "dd-MMM-yyyy")}, ${formatTimeTo12Hour(parseInt(time.slice(0, 2)), parseInt(time.slice(3)))}`
                  ) : (
                    <span>Pick Date & Time</span>
                  )}
                  <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                </Button>
              </FormControl>
            </PopoverTrigger>
            <PopoverContent className="flex w-auto items-start p-0" align="start">
              <Calendar
                mode="single"
                captionLayout="dropdown"
                selected={date ?? field.value}
                onSelect={(selectedDate) => {
                  const [hours, minutes] = time?.split(":");
                  selectedDate?.setHours(parseInt(hours ?? "0"), parseInt(minutes ?? "0"));
                  setDate(selectedDate ?? null);
                  field.onChange(selectedDate);
                }}
                // onDayClick={() => setIsOpen(false)}
                fromYear={new Date().getFullYear()}
                toYear={new Date().getFullYear() + 1}
                disabled={(date) => Number(date) < Date.now() - 1000 * 60 * 60 * 24}
              />
              <div className="my-4 flex flex-col gap-1 p-3">
                <p className="text-sm font-semibold">Select Time</p>
                <Select
                  defaultValue={time}
                  onValueChange={(e) => {
                    setTime(e);
                    if (date) {
                      const [hours, minutes] = e.split(":");
                      const newDate = new Date(date.getTime());
                      newDate.setHours(parseInt(hours ?? "0"), parseInt(minutes ?? "0"));
                      setDate(newDate);
                      field.onChange(newDate);
                    }
                    onTimeSelect?.();
                    setIsOpen(false);
                  }}>
                  <SelectTrigger className="mr-2 w-[120px] font-normal focus:ring-0">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent
                    className="fixed left-0 top-2 mr-2 border-none shadow-none"
                    onSelect={() => setIsOpen(false)}>
                    <ScrollArea className="h-[15rem]">
                      {Array.from({ length: 96 }).map((_, i) => {
                        const hour = Math.floor(i / 4)
                          .toString()
                          .padStart(2, "0");
                        const minute = ((i % 4) * 15).toString().padStart(2, "0");
                        return (
                          <SelectItem key={i} value={`${hour}:${minute}`}>
                            {formatTimeTo12Hour(parseInt(hour), parseInt(minute))}
                          </SelectItem>
                        );
                      })}
                    </ScrollArea>
                  </SelectContent>
                </Select>
              </div>
            </PopoverContent>
          </Popover>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}
