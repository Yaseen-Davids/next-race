import { FC } from "react";
import { Field, useForm } from "react-final-form";
import {
  Select,
  SelectContent,
  SelectTrigger,
  SelectValue,
  SelectItem,
} from "../ui/select";
import XMarkIcon from "@heroicons/react/24/outline/XMarkIcon";

const validate = (value: any) =>
  value && value != "" ? undefined : "Required";

type TextComboProps = {
  label: string;
  field: string;
  required?: boolean;
  multiple?: boolean;
  data: { value: string; label: string }[];
};

export const TextCombo: FC<TextComboProps> = ({
  label,
  field,
  data,
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
      <label
        htmlFor={field}
        className="block text-sm/6 font-medium text-gray-900"
      >
        {label}
      </label>
      <div className="mt-1">
        <Field
          name={field}
          validate={required ? validate : () => {}}
          render={({ input, meta }) => (
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
                  className={`w-full ${
                    meta.error && meta.touched ? "border-red-600" : ""
                  }`}
                >
                  <SelectValue placeholder="" />
                </SelectTrigger>
                <SelectContent>
                  {data.map((row, i) => (
                    <SelectItem key={i} value={row.value}>
                      {row.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {meta.error && meta.touched && (
                <span className="text-red-600 text-xs">{meta.error}</span>
              )}
            </>
          )}
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
