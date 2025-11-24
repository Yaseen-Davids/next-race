import { statusColor } from "../Calendar";
import { TextCombo } from "@/components/form/ComboField";
import { DateField } from "@/components/form/DateField";
import { SelectField } from "@/components/form/SelectField";
import { SwitchField } from "@/components/form/SwitchField";
import { TabsContent } from "@/components/ui/tabs";
import { CalendarDays, Car, LaptopMinimal, LayoutList } from "lucide-react";
import { FC } from "react";

type Props = {
  loadingCars: boolean;
  cars: { label: string; value: string }[];
};

export const TabEvent: FC<Props> = ({ cars, loadingCars }) => {
  return (
    <TabsContent value="event" className="space-y-4">
      <p className="text-gray-500 text-sm mt-4">
        Everything you need to prepare this race video — cars, platform, status,
        and more.
      </p>
      <DateField
        field="date"
        placeholder="Pick a date"
        label={
          <span className="flex flex-row gap-2 items-center">
            <CalendarDays className="w-4 h-4 text-gray-400" /> <span>Date</span>
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
          data={[
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
          ]}
        />
        <SelectField
          field="platform"
          label={
            <span className="flex flex-row gap-2 items-center">
              <LaptopMinimal className="w-4 h-4 text-gray-400" />{" "}
              <span>Platform</span>
            </span>
          }
          data={[
            { label: "YouTube", value: "youtube", icon: "youtube" },
            {
              label: "YouTube Shorts",
              value: "youtube_shorts",
              icon: "youtube_shorts",
            },
            { label: "TikTok", value: "tiktok", icon: "tiktok" },
            { label: "Instagram", value: "instagram", icon: "instagram" },
          ]}
        />
      </div>
      <div className="grid grid-cols-2 gap-2">
        <TextCombo
          required
          field="car1"
          label={
            <span className="flex flex-row gap-2 items-center">
              <Car className="w-4 h-4 text-gray-400" /> <span>Car 1</span>
            </span>
          }
          data={cars}
          isFetching={loadingCars}
        />
        <TextCombo
          required
          field="car2"
          label={
            <span className="flex flex-row gap-2 items-center">
              <Car className="w-4 h-4 text-gray-400" /> <span>Car 2</span>
            </span>
          }
          data={cars}
          isFetching={loadingCars}
        />
      </div>
      <TextCombo
        required
        field="car3"
        label={
          <span className="flex flex-row gap-2 items-center">
            <Car className="w-4 h-4 text-gray-400" /> <span>Car 3</span>
          </span>
        }
        data={cars}
        isFetching={loadingCars}
      />
      <SwitchField field="user_comment" label="Viewer suggested?" />
    </TabsContent>
  );
};
