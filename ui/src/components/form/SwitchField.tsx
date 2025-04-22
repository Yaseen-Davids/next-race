import { FC } from "react";
import { Field } from "react-final-form";
import { Switch } from "../ui/switch";

type SwitchFieldProps = {
  label: string;
  field: string;
  required?: boolean;
  disabled?: boolean;
  type?: string;
};

export const SwitchField: FC<SwitchFieldProps> = ({ field, label }) => {
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
          render={({ input }) => (
            <Switch checked={input.value} onCheckedChange={input.onChange} />
          )}
        />
      </div>
    </div>
  );
};
