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
import axios, { AxiosResponse } from "axios";

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

const statusColor: { [status: string]: string } = {
  new: "bg-green-100 text-green-800",
  recorded: "bg-orange-100 text-orange-600",
  edited: "bg-yellow-100 text-yellow-600",
  done: "bg-gray-200 text-gray-400",
};

interface UserEvent {
  event_id: string;
  event_date: string;
  event_status: string;
  race_title: string;
}

type HomeProps = {};

export const Home: FC<HomeProps> = ({}) => {
  const [selectedDate, setSelectedDate] = useState<Date>();
  const [calendarDate, setCalendarDate] = useState<Date>();
  const [selectedEventId, setSelectedEventId] = useState<string>();

  const defaultDate = useMemo(() => new Date(), []);

  const { data } = useQuery<AxiosResponse<UserEvent[]>>({
    queryKey: ["events-by-user", calendarDate],
    queryFn: () =>
      axios.get(
        `/api/events/byUser?inputDate=${format(
          calendarDate || new Date(),
          "yyyy-MM-dd"
        )}`
      ),
  });

  const events = useMemo(
    () =>
      (data?.data || []).map((d) => ({
        id: d.event_id,
        name: d.race_title,
        start: new Date(d.event_date),
        end: new Date(d.event_date),
        status: d.event_status,
      })),
    [data?.data]
  );

  return (
    <div className="p-8 h-[700px]">
      {(selectedDate || selectedEventId) && (
        <CreateEventDialog
          date={selectedDate}
          eventId={selectedEventId}
          handleClose={() => {
            setSelectedDate(undefined);
            setSelectedEventId(undefined);
          }}
        />
      )}
      <Calendar
        selectable
        events={events}
        views={["month"]}
        endAccessor="end"
        defaultView="month"
        startAccessor="start"
        localizer={localizer}
        defaultDate={defaultDate}
        onNavigate={(newDate) => setCalendarDate(newDate)}
        onSelectSlot={(slot) => setSelectedDate(slot.start)}
        onSelectEvent={(slot) => setSelectedEventId(slot.id)}
        components={{
          showMore: () => <></>,
          month: {
            event: (
              ev: EventProps<Event & { name: string; status: string }>
            ) => {
              return (
                <p
                  className={`text-xs text-center px-2 py-1 rounded whitespace-nowrap ${
                    statusColor[ev.event.status]
                  }`}
                >
                  {ev.event.name}
                </p>
              );
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
