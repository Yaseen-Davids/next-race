import { useCarsApi } from "@/lib/api/cars";
import { FC, useState } from "react";
import { CarDialog } from "../car/CarDialog";
import { PlusCircleIcon } from "lucide-react";

type CarsListProps = {};

export const CarsList: FC<CarsListProps> = ({}) => {
  const { data: cars } = useCarsApi.useAll();
  const [carId, setCarId] = useState<string | undefined>(undefined);
  const [addNewCar, toggleNewCar] = useState(false);

  return (
    <div className="flex flex-col gap-2">
      {(carId || addNewCar) && (
        <CarDialog
          carId={carId}
          handleClose={() => {
            setCarId(undefined);
            toggleNewCar(false);
          }}
        />
      )}
      <div className="flex flex-row justify-between items-center">
        <p className="text-xl text-gray-700 font-bold">Cars ({cars?.length})</p>
        <PlusCircleIcon
          className="h-6 w-6 cursor-pointer hover:text-red-600 transition ease-in-out"
          onClick={() => toggleNewCar(true)}
        />
      </div>
      <div className="flex flex-col gap-1 max-h-[calc(100dvh_-_120px)] overflow-y-auto">
        {cars
          ?.sort((a, b) => a.name.localeCompare(b.name))
          .map((car) => (
            <div
              className="flex flex-row items-center cursor-pointer"
              onClick={() => setCarId(car.id)}
            >
              <p className="text-sm text-gray-700">{car.name}</p>
            </div>
          ))}
      </div>
    </div>
  );
};
