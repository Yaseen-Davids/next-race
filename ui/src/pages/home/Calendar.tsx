import { FC, useMemo, useState } from "react";
import { format, parse, startOfWeek, getDay } from "date-fns";
import { enUS } from "date-fns/locale";
import { Calendar, dateFnsLocalizer, ToolbarProps } from "react-big-calendar";
import { Button } from "@/components/ui/button";
import "react-big-calendar/lib/css/react-big-calendar.css";
import { useQueryClient } from "@tanstack/react-query";
import withDragAndDrop from "react-big-calendar/lib/addons/dragAndDrop";
import { toast } from "sonner";
import { useEventsApi, useEventsByUser } from "@/lib/api/events";

const DnDCalendar = withDragAndDrop(Calendar);

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

export const statusColor: { [status: string]: string } = {
  new: "bg-green-100 text-green-800",
  raced: "bg-cyan-100 text-cyan-800",
  recorded: "bg-orange-100 text-orange-600",
  edited: "bg-yellow-100 text-yellow-600",
  done: "bg-gray-100 text-gray-400",
};

export interface UserEvent {
  event_id: string;
  event_date: string;
  event_status: string;
  race_title: string;
}

type EventsCalendarProps = {
  setSelectedDate(newDate: Date): void;
  setSelectedEventId(id: string): void;
};

export const EventsCalendar: FC<EventsCalendarProps> = ({
  setSelectedDate,
  setSelectedEventId,
}) => {
  const queryClient = useQueryClient();
  const [calendarDate, setCalendarDate] = useState<Date>();

  const defaultDate = useMemo(() => new Date(), []);

  const { data } = useEventsByUser(
    format(calendarDate || new Date(), "yyyy-MM-dd")
  );

  const events = useMemo(
    () =>
      (data || []).map((d) => ({
        id: d.event_id,
        name: d.race_title,
        start: new Date(d.event_date),
        end: new Date(d.event_date),
        status: d.event_status,
        type: d.event_type,
      })),
    [data]
  );

  const { mutateAsync: upsertEvent } = useEventsApi.useUpdate();

  const handleDrop = async (eventId: string, newDate: Date) => {
    await upsertEvent({
      id: eventId,
      data: { date: format(newDate, "yyyy-MM-dd") },
    });
    queryClient.invalidateQueries({
      queryKey: ["events"],
    });
    toast.success("Event successfully moved!");
  };

  return (
    <DnDCalendar
      selectable
      events={events}
      views={["month"]}
      defaultView="month"
      localizer={localizer}
      defaultDate={defaultDate}
      draggableAccessor={(event: any) => event.status !== "done"}
      onNavigate={(newDate) => setCalendarDate(newDate)}
      onSelectSlot={(slot) => setSelectedDate(slot.start)}
      onSelectEvent={(slot: any) => setSelectedEventId(slot.id)}
      onEventDrop={(props: any) => handleDrop(props.event.id, props.start)}
      components={{
        showMore: () => <></>,
        month: {
          event: (ev: any) => {
            return (
              <p
                title={ev.event.name}
                className={`flex flex-row gap-2 text-xs text-center px-2 py-1 ${
                  statusColor[ev.event.status]
                } rounded-full sm:rounded`}
              >
                <img
                  src={`logos/${ev.event.type}.png`}
                  alt={ev.event.type}
                  className="w-4 h-4"
                />
                <span className="hidden sm:block">{ev.event.name}</span>
                <span className="block sm:hidden h-1 w-4"></span>
              </p>
            );
          },
        },
      }}
    />
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
