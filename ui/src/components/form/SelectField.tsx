import { FC } from "react";
import { Field, useForm } from "react-final-form";
import XMarkIcon from "@heroicons/react/24/outline/XMarkIcon";
import { LoadingSpinner } from "../LoadingSpinner";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { cn } from "@/lib/utils";

const validate = (value: any) =>
  value && value != "" ? undefined : "Required";

type SelectFieldProps = {
  label: string;
  field: string;
  isFetching?: boolean;
  required?: boolean;
  multiple?: boolean;
  data: { value: string; label: string; icon?: string; color?: string }[];
};

export const SelectField: FC<SelectFieldProps> = ({
  label,
  field,
  data,
  isFetching,
  required = false,
  multiple = false,
}) => {
  const form = useForm();

  const handleClearSelect = (value: string) => {
    const filtered = (form.getState().values[field] || []).filter(
      (v: string) => v != value
    );
    form.change(field, filtered);
  };

  return (
    <div>
      <label htmlFor={field} className="block text-sm/6 font-medium">
        {label}
      </label>
      <div className="mt-1">
        <Field
          name={field}
          validate={required ? validate : () => {}}
          render={({ input, meta }) => {
            return (
              <>
                <Select
                  {...input}
                  onValueChange={(value) => {
                    if (value == "") return;
                    if (multiple) {
                      const selected = form.getState().values[field] || [];
                      if (!selected.some((s: string) => s == value)) {
                        form.change(field, [...selected, value]);
                      }
                    } else {
                      form.change(field, value);
                    }
                  }}
                >
                  <SelectTrigger
                    className={`relative w-full ${
                      meta.error && meta.touched ? "border-red-600" : ""
                    }`}
                  >
                    <SelectValue placeholder="" />
                    {isFetching && (
                      <LoadingSpinner
                        isButton
                        size={"xs"}
                        className="absolute right-1 top-1"
                      />
                    )}
                  </SelectTrigger>
                  <SelectContent>
                    {data.map((row, i) => (
                      <SelectItem
                        key={i}
                        value={row.value}
                        className={cn("", row.color)}
                      >
                        <span>{row.label}</span>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {meta.error && meta.touched && (
                  <span className="text-red-600 text-xs">{meta.error}</span>
                )}
              </>
            );
          }}
          className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
        />
      </div>
      {multiple && (
        <div className="flex flex-row mt-2 flex-wrap gap-1">
          {(form.getState().values[field] || []).map((s: any, k: number) => (
            <div
              key={`multi_${k}`}
              className="flex flex-row rounded-full space-x-1 items-center justify-center bg-blue-100 text-blue-600 px-4 p-1 rounded-full text-sm font-medium"
            >
              <p className="">
                {(data.find((d) => d.value == s) || { label: "" })?.label}
              </p>
              <XMarkIcon
                className="h-4 w-4"
                onClick={() => handleClearSelect(s)}
              />
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
