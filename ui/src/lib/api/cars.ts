import { createWriteableHooks, useApiGet } from "./base";

export interface Car {
  id: string;
  name: string;
  class: string;
  user_id: string;
  hp: number;
  nm: number;
  kg: number;
  "0_100": number;
  "0_200": number;
  "0_250": number;
  "0_300": number;
  "0_350": number;
  "0_400": number;
  "0_500": number;
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
