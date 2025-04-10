import { FC } from "react";
import { Field } from "react-final-form";
import { Calendar } from "../ui/calendar";
import { CalendarIcon } from "lucide-react";
import { format } from "date-fns";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { Button } from "../ui/button";
import { cn } from "@/lib/utils";

const validate = (value: any) =>
  value && value != "" ? undefined : "Required";

type DateFieldProps = {
  label: string;
  field: string;
  placeholder?: string;
  required?: boolean;
  disabled?: boolean;
};

export const DateField: FC<DateFieldProps> = ({
  label,
  field,
  placeholder,
  required = false,
  disabled = false,
}) => {
  return (
    <div>
      <label
        htmlFor={field}
        className="block text-sm/6 font-medium text-gray-900"
      >
        {label}
      </label>
      <div className="mt-1">
        <Field
          validate={required ? validate : () => {}}
          name={field}
          type={"date"}
          render={({ input, meta }) => (
            <div className="relative">
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    disabled={disabled}
                    variant={"outline"}
                    className={cn(
                      "w-full justify-start text-left font-normal",
                      !input.value && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon />
                    {input.value ? (
                      format(input.value, "PPP")
                    ) : (
                      <span>{placeholder}</span>
                    )}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={input.value}
                    onSelect={input.onChange}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
              {meta.error && meta.touched && (
                <span className="text-red-600 text-xs">{meta.error}</span>
              )}
            </div>
          )}
          className={`block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 placeholder:text-gray-400 sm:text-sm/6`}
        />
      </div>
    </div>
  );
};
