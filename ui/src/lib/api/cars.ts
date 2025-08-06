import { createWriteableHooks, useApiGet } from "./base";

export interface Car {
  id: string;
  name: string;
  class: string;
  user_id: string;
  created_at: Date;
  updated_at: Date;
}

export const useCarsApi = createWriteableHooks<Car>({
  endpoint: "/cars",
  queryKey: "cars",
});

export const useCarsToRace = (primaryCarID: string) =>
  useApiGet<{ id: string; name: string }[]>({
    endpoint: `/cars/carsToRace/${primaryCarID}`,
    queryKey: "cars",
  });
