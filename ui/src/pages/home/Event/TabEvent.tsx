import { FC, useMemo, useState } from "react";
import { statusColor } from "../Calendar";
import { TextCombo } from "@/components/form/ComboField";
import { DateField } from "@/components/form/DateField";
import { SelectField } from "@/components/form/SelectField";
import { SwitchField } from "@/components/form/SwitchField";
import { TabsContent } from "@/components/ui/tabs";
import { useCarsApi } from "@/lib/api/cars";
import { CarDialog } from "@/pages/car/CarDialog";
import { useQueryClient } from "@tanstack/react-query";
import { CalendarDays, Car, LaptopMinimal, LayoutList, X } from "lucide-react";
import { useFormState, useForm } from "react-final-form";
import { Button } from "@/components/ui/button";

type Props = {};

export const TabEvent: FC<Props> = ({}) => {
  const form = useForm();
  const state = useFormState();
  const queryClient = useQueryClient();
  const [addCarDialog, toggleCarDialog] = useState(false);

  const { data, isFetching: fetchingCars } = useCarsApi.useAll();

  const handleCloseCarDialog = async () => {
    toggleCarDialog(false);
    queryClient.invalidateQueries({ queryKey: ["cars"] });
  };

  const cars = useMemo(
    () =>
      (data || [])
        .map((d) => ({
          value: d.id,
          label: d.name,
        }))
        .sort((a, b) => a.label.localeCompare(b.label)),
    [data],
  );

  const usedCarKeys = useMemo(() => {
    return Object.keys(state.values)
      .filter((k) => /^car\d+$/.test(k))
      .sort(
        (a, b) => Number(a.match(/\d+$/)![0]) - Number(b.match(/\d+$/)![0]),
      );
  }, [state.values]);

  console.log("🚀 ~ TabEvent ~ state.values:", state.values);

  const handleAddCarToForm = () => {
    const keys = usedCarKeys;
    const nextIndex =
      keys.length === 0
        ? 1
        : Math.max(...keys.map((k) => Number(k.match(/\d+$/)![0]))) + 1;
    form.change(`car${nextIndex}`, { value: "", label: "" });
  };

  const handleRemoveCarFromForm = (key: string) => {
    // remove the car key from the form values completely
    const values = form.getState().values as Record<string, any>;
    const { [key]: _, ...rest } = values;
    form.initialize(rest);
  };

  return (
    <>
      {addCarDialog && <CarDialog handleClose={() => handleCloseCarDialog()} />}
      <TabsContent value="event" className="space-y-4">
        <p className="text-gray-500 text-sm mt-4">
          Everything you need to prepare this race video — cars, platform,
          status, and more.
        </p>
        <DateField
          field="date"
          placeholder="Pick a date"
          label={
            <span className="flex flex-row gap-2 items-center">
              <CalendarDays className="w-4 h-4 text-gray-400" />{" "}
              <span>Date</span>
            </span>
          }
        />
        <div className="grid grid-cols-2 gap-2">
          <SelectField
            field="status"
            label={
              <span className="flex flex-row gap-2 items-center">
                <LayoutList className="w-4 h-4 text-gray-400" />{" "}
                <span>Status</span>
              </span>
            }
            data={EVENT_STATUS}
          />
          <SelectField
            field="platform"
            label={
              <span className="flex flex-row gap-2 items-center">
                <LaptopMinimal className="w-4 h-4 text-gray-400" />{" "}
                <span>Platform</span>
              </span>
            }
            data={EVENT_PLATFORM}
          />
        </div>
        <div className="flex items-center">
          <button
            type="button"
            className="bg-white text-xs text-blue-500 mt-2"
            onClick={() => toggleCarDialog((prev) => !prev)}
          >
            Add a new car
          </button>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          {usedCarKeys.map((k, i) => (
            <div key={k} className="flex items-center gap-2 relative">
              <div className="flex-1">
                <TextCombo
                  required
                  field={k}
                  label={
                    <span className="flex flex-row gap-2 items-center">
                      <Car className="w-4 h-4 text-gray-400" />{" "}
                      <span>Car {i + 1}</span>
                    </span>
                  }
                  data={cars}
                  isFetching={fetchingCars}
                />
              </div>
              <Button
                type="button"
                variant="ghost"
                className="!p-2 absolute top-0 right-1"
                onClick={() => handleRemoveCarFromForm(k)}
                aria-label={`Remove ${k}`}
              >
                <X className="w-4 h-4 text-red-500" />
              </Button>
            </div>
          ))}
          <Button
            className="mt-7"
            variant="outline"
            type="button"
            onClick={handleAddCarToForm}
          >
            Add car
          </Button>
        </div>
        <SwitchField field="user_comment" label="Viewer suggested?" />
      </TabsContent>
    </>
  );
};

const EVENT_STATUS = [
  {
    label: "New",
    value: "new",
    color: statusColor["new"].split(" ")[1],
  },
  {
    label: "Raced",
    value: "raced",
    color: statusColor["raced"].split(" ")[1],
  },
  {
    label: "Recorded",
    value: "recorded",
    color: statusColor["recorded"].split(" ")[1],
  },
  {
    label: "Edited",
    value: "edited",
    color: statusColor["edited"].split(" ")[1],
  },
  {
    label: "Done",
    value: "done",
    color: statusColor["done"].split(" ")[1],
  },
];

const EVENT_PLATFORM = [
  { label: "YouTube", value: "youtube", icon: "youtube" },
  {
    label: "YouTube Shorts",
    value: "youtube_shorts",
    icon: "youtube_shorts",
  },
  { label: "TikTok", value: "tiktok", icon: "tiktok" },
  { label: "Instagram", value: "instagram", icon: "instagram" },
];
