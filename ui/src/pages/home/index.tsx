import { FC, useMemo, useState } from "react";
import { format, parse, startOfWeek, getDay } from "date-fns";
import { enUS } from "date-fns/locale";
import { Calendar, dateFnsLocalizer, ToolbarProps } from "react-big-calendar";
import { Button } from "@/components/ui/button";
import "react-big-calendar/lib/css/react-big-calendar.css";
import { CreateEventDialog } from "./CreateEventDialog";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import axios, { AxiosResponse } from "axios";
import withDragAndDrop from "react-big-calendar/lib/addons/dragAndDrop";
import { toast } from "sonner";

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

const statusColor: { [status: string]: string } = {
  new: "bg-green-100 text-green-800",
  raced: "bg-cyan-100 text-cyan-800",
  recorded: "bg-orange-100 text-orange-600",
  edited: "bg-yellow-100 text-yellow-600",
  done: "bg-gray-200 text-gray-400",
};

export interface UserEvent {
  event_id: string;
  event_date: string;
  event_status: string;
  race_title: string;
}

type HomeProps = {};

export const Home: FC<HomeProps> = ({}) => {
  const queryClient = useQueryClient();

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

  const { mutateAsync: upsertEvent } = useMutation({
    mutationKey: ["upsert-event"] as string[],
    mutationFn: async (values: any) => {
      console.log("🚀 ~ values:", values);
      return await axios.put(`/api/events/${values.eventId}`, values.values);
    },
  });

  const handleDrop = async (eventId: string, newDate: Date) => {
    await upsertEvent({
      eventId,
      values: { date: format(newDate, "yyyy-MM-dd") },
    });
    queryClient.invalidateQueries({
      queryKey: ["events-by-user"],
    });
    toast.success("Event successfully moved!");
  };

  return (
    <div className="h-[700px]">
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
      <div className="h-full w-full p-4">
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
                    className={`text-xs text-center px-2 py-1 rounded ${
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
