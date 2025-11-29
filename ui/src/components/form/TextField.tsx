import { FC, useEffect, useRef, useState } from "react";
import { Field } from "react-final-form";
import { Textarea } from "../ui/textarea";
import { Input } from "../ui/input";
import EyeIcon from "@heroicons/react/24/outline/EyeIcon";
import EyeSlashIcon from "@heroicons/react/24/outline/EyeSlashIcon";

const validate = (value: any) =>
  value && value != "" ? undefined : "Required";

type TextFieldProps = {
  label: string;
  field: string;
  required?: boolean;
  disabled?: boolean;
  type?: string;
  multiline?: boolean;
  placeholder?: string;
  inputStyle?: string;
  rows?: number;
  autoFocus?: boolean;
};

export const TextField: FC<TextFieldProps> = ({
  label,
  field,
  required = false,
  disabled = false,
  placeholder = "",
  type = "text",
  multiline = false,
  inputStyle = "",
  rows = 3,
  autoFocus,
}) => {
  const [showPassword, toggleShowPassword] = useState(false);

  const ref = useRef<HTMLInputElement | HTMLTextAreaElement>(null);

  useEffect(() => {
    if (autoFocus && ref.current) {
      ref.current.focus();
    }
  }, [ref.current, autoFocus]);

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
          type={type === "password" ? (showPassword ? "text" : type) : type}
          render={({ input, meta }) =>
            multiline ? (
              <div className="w-full">
                <Textarea
                  ref={ref as React.Ref<HTMLTextAreaElement>}
                  rows={rows}
                  disabled={disabled}
                  onChange={input.onChange}
                  value={input.value}
                  placeholder={placeholder}
                  className={`w-full placeholder:text-sm ${inputStyle} ${
                    meta.error && meta.touched ? "border-red-600" : ""
                  }`}
                />
                {meta.error && meta.touched && (
                  <span className="text-red-600 text-xs">{meta.error}</span>
                )}
              </div>
            ) : (
              <div className="relative">
                <Input
                  ref={ref as React.Ref<HTMLInputElement>}
                  type={input.type}
                  disabled={disabled}
                  onChange={input.onChange}
                  defaultValue={input.value}
                  placeholder={placeholder}
                  className={`placeholder:text-sm ${inputStyle} w-full ${
                    meta.error && meta.touched ? "border-red-600" : ""
                  }`}
                />
                {meta.error && meta.touched && (
                  <span className="text-red-600 text-xs">{meta.error}</span>
                )}
                {type == "password" ? (
                  showPassword ? (
                    <EyeSlashIcon
                      className="absolute right-2 top-2 h-5 w-5 text-gray-600"
                      onClick={() => toggleShowPassword((s) => !s)}
                    />
                  ) : (
                    <EyeIcon
                      className="absolute right-2 top-2 h-5 w-5 text-gray-600"
                      onClick={() => toggleShowPassword((s) => !s)}
                    />
                  )
                ) : (
                  <></>
                )}
              </div>
            )
          }
          className={`block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 placeholder:text-gray-400 sm:text-sm/6`}
        />
      </div>
    </div>
  );
};
