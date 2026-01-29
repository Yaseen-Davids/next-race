import { FC, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { Car, useCarsApi } from "@/lib/api/cars";
import { Button } from "@/components/ui/button";
import { CarDialog } from "./CarDialog";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import XMarkIcon from "@heroicons/react/24/outline/XMarkIcon";

type Props = {};

export const Cars: FC<Props> = () => {
  const navigate = useNavigate();

  const [carId, setCarId] = useState<string | undefined>(undefined);
  const [toggleCarEdit, setToggleCarEdit] = useState<boolean>(false);
  const [search, setSearch] = useState<string | undefined>();

  const { data: cars } = useCarsApi.useAll();

  const filtered = useMemo(() => {
    if (!search) return cars;

    const lower = search.toLowerCase();

    return (cars || []).filter((car) =>
      (Object.keys(car) as Array<keyof Car>).some((key) => {
        const value = car[key];
        return (
          value !== null &&
          value !== undefined &&
          String(value).toLowerCase().includes(lower)
        );
      }),
    );
  }, [search, cars]);

  return (
    <div className="p-4 flex flex-col gap-4">
      {(carId || toggleCarEdit) && (
        <CarDialog
          carId={carId}
          handleClose={() => {
            setCarId(undefined);
            setToggleCarEdit(false);
          }}
        />
      )}
      <div className="flex flex-col gap-8">
        <h2
          className="flex flex-row gap-4 items-center group cursor-pointer"
          onClick={() => navigate("/")}
        >
          <ArrowLeft className="transform transition-transform translate-x-2 ease-in duration-200 group-hover:translate-x-0" />
          <span className="text-xl font-bold">Home</span>
        </h2>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-4">
          <Button
            variant="outline"
            className="bg-emerald-100 text-emerald-600 border-emerald-100 hover:bg-emerald-200"
            onClick={() => setToggleCarEdit(true)}
          >
            Add a new car
          </Button>
          <div className="relative">
            <Input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search..."
            />
            {search && search !== "" && (
              <XMarkIcon
                className="absolute right-3 top-2.5 w-4 h-4 text-gray-400 cursor-pointer"
                onClick={() => setSearch("")}
              />
            )}
          </div>
        </div>
      </div>
      <div className="flex flex-col gap-4 sm:flex-row flex-wrap">
        {filtered
          ?.sort((a, b) => a.name.localeCompare(b.name))
          .map((car) => (
            <Card
              key={`car-${car.id}`}
              onClick={() => setCarId(car.id)}
              className="w-full sm:w-[300px] cursor-pointer"
            >
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-base font-bold">
                  {car.name}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-500 font-bold">
                  {car.hp ?? "-"}hp | {car.nm ?? "-"}nm | {car.kg ?? "-"}kg
                </p>
                <div className="text-sm text-gray-500 grid grid-cols-5 mt-2">
                  <p className="grid grid-rows-2 text-center border divide-y border-gray-200">
                    <span className="text-gray-400">0-100</span>
                    <span className="text-gray-600 font-bold">
                      {car["0_100"] ?? "-"}
                      {car["0_100"] ? "s" : ""}
                    </span>
                  </p>
                  <p className="grid grid-rows-2 text-center border divide-y border-gray-200">
                    <span className="text-gray-400">0-200</span>
                    <span className="text-gray-600 font-bold">
                      {car["0_200"] ?? "-"}
                      {car["0_200"] ? "s" : ""}
                    </span>
                  </p>
                  <p className="grid grid-rows-2 text-center border divide-y border-gray-200">
                    <span className="text-gray-400">0-300</span>
                    <span className="text-gray-600 font-bold">
                      {car["0_300"] ?? "-"}
                      {car["0_300"] ? "s" : ""}
                    </span>
                  </p>
                  <p className="grid grid-rows-2 text-center border divide-y border-gray-200">
                    <span className="text-gray-400">0-350</span>
                    <span className="text-gray-600 font-bold">
                      {car["0_350"] ?? "-"}
                      {car["0_350"] ? "s" : ""}
                    </span>
                  </p>
                  <p className="grid grid-rows-2 text-center border divide-y border-gray-200">
                    <span className="text-gray-400">0-400</span>
                    <span className="text-gray-600 font-bold">
                      {car["0_400"] ?? "-"}
                      {car["0_400"] ? "s" : ""}
                    </span>
                  </p>
                </div>
              </CardContent>
            </Card>
          ))}
      </div>
    </div>
  );
};
