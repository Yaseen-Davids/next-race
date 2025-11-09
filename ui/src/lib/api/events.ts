import { createWriteableHooks, useApiGet, useApiPost } from "./base";

interface Event {
  id: string;
  date: string;
  status: string;
  platform: string;
  user_id: string;
  created_at: Date;
  updated_at: Date;
  user_comment: string;
}

interface EventsByUser {
  event_id: string;
  event_status: string;
  event_date: Date;
  race_title: string;
  event_type: string;
}

interface EventsWithCars extends Event {
  cars: { value: string; label: string }[];
}

export const useEventsApi = createWriteableHooks<Event>({
  endpoint: "events",
  queryKey: "events",
});

export const useEventsByUser = (inputDate: string) =>
  useApiGet<EventsByUser[]>({
    endpoint: `/events/byUser?inputDate=${inputDate}`,
    queryKey: "events",
  });

export const useEventsWithCars = (eventId: string) =>
  useApiGet<EventsWithCars[]>({
    endpoint: `/events/byIdWithCars/${eventId}`,
    queryKey: "events",
  });

export const useNextEvents = () =>
  useApiPost({
    endpoint: "/events/new-event",
    queryKey: "events",
  });
