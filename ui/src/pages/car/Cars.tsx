import { FC, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { Car, useCarsApi } from "@/lib/api/cars";
import { Button } from "@/components/ui/button";
import { CarDialog } from "./CarDialog";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

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
      })
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
          <div>
            <Input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search..."
            />
          </div>
        </div>
      </div>
      <div className="flex flex-col gap-2 sm:flex-row flex-wrap">
        {filtered
          ?.sort((a, b) => a.name.localeCompare(b.name))
          .map((car) => (
            <Card
              key={`car-${car.id}`}
              onClick={() => setCarId(car.id)}
              className="w-full sm:w-[300px] cursor-pointer"
            >
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-bold">{car.name}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-xs text-gray-500">
                  {car.hp ?? "-"}hp | {car.nm ?? "-"}nm | {car.kg ?? "-"}kg
                </p>
              </CardContent>
            </Card>
          ))}
      </div>
    </div>
  );
};
