import { FC, useState } from "react";
import { CreateEventDialog } from "./Event/Create";
import { EventsCalendar } from "./Calendar";
import { useCarsApi } from "@/lib/api/cars";
import { ArrowRightIcon } from "lucide-react";
import { useNavigate } from "react-router-dom";

type HomeProps = {};

export const Home: FC<HomeProps> = ({}) => {
  const navigate = useNavigate();

  const [selectedDate, setSelectedDate] = useState<Date>();
  const [selectedEventId, setSelectedEventId] = useState<string>();

  const { data: cars } = useCarsApi.useAll();

  return (
    <div className="h-[calc(100dvh_-_100px)] py-2">
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
      <div className="grid grid-cols-1 xl:grid-cols-5 px-4">
        <div
          className="flex flex-row justify-between p-4 border rounded-md cursor-pointer group hover:text-gray-600 transition"
          onClick={() => navigate("/cars")}
        >
          <p className="font-bold">View all cars ({cars?.length || 0})</p>
          <ArrowRightIcon className="transform transition-transform ease-in duration-200 group-hover:translate-x-2" />
        </div>
      </div>
      <div className="h-full w-full p-4">
        <EventsCalendar
          setSelectedDate={setSelectedDate}
          setSelectedEventId={setSelectedEventId}
        />
      </div>
    </div>
  );
};
