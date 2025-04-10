import { FC, useMemo, useState } from "react";
import { format, parse, startOfWeek, getDay } from "date-fns";
import { enUS } from "date-fns/locale";
import {
  Calendar,
  dateFnsLocalizer,
  EventProps,
  ToolbarProps,
  Event,
} from "react-big-calendar";
import { Button } from "@/components/ui/button";

import "react-big-calendar/lib/css/react-big-calendar.css";
import { CreateEventDialog } from "./CreateEventDialog";
import { useQuery } from "@tanstack/react-query";

const locales = {
  "en-US": enUS,
};

const localizer = dateFnsLocalizer({
  format,
  parse,
  startOfWeek,
  getDay,
  locales,
});

type HomeProps = {};

export const Home: FC<HomeProps> = ({}) => {
  // TODO
  // const {} = useQuery({
  //   queryFn: () => axios.get("/api/events/by-user")
  // });

  const [selectedDate, setSelectedDate] = useState<Date>();

  const defaultDate = useMemo(() => new Date(), []);

  return (
    <div className="p-8 h-[700px]">
      {selectedDate && (
        <CreateEventDialog
          date={selectedDate}
          handleClose={() => setSelectedDate(undefined)}
        />
      )}
      <Calendar
        selectable
        events={[]}
        views={["month"]}
        endAccessor="end"
        defaultView="month"
        startAccessor="start"
        // showAllEvents={false}
        localizer={localizer}
        defaultDate={defaultDate}
        // onNavigate={(newDate) => setSelectedDate(newDate)}
        onSelectSlot={(slot) => setSelectedDate(slot.start)}
        // onSelectEvent={(slot) => {
        //   console.log("🚀 ~ App ~ slot:", slot);
        // }}
        // style={{ height: "100%" }}
        components={{
          showMore: () => <></>,
          // toolbar: CustomToolbar,
          month: {
            event: (ev: EventProps<Event & { name: string }>) => {
              return <p className="text-xs">{ev.event.name}</p>;
            },
          },
        }}
      />
    </div>
  );
};

interface CustomToolbarProps extends ToolbarProps {}

export const CustomToolbar: FC<CustomToolbarProps> = ({
  label,
  onNavigate,
}) => {
  return (
    <div className="rbc-toolbar">
      <p className="rbc-toolbar-label">{label}</p>
      <div className={"flex flex-row gap-6"}>
        <Button
          className="bg-white text-gray-700 hover:bg-gray-100/50"
          type="button"
          onClick={() => onNavigate("PREV")}
        >
          &#60;
        </Button>
        <Button
          className="bg-white text-gray-700 hover:bg-gray-100/50"
          type="button"
          onClick={() => onNavigate("NEXT")}
        >
          &#62;
        </Button>
      </div>
    </div>
  );
};
