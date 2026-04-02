import { TabsContent } from "@/components/ui/tabs";
import { Car, useCarsToRace } from "@/lib/api/cars";
import { Skeleton } from "@/components/ui/skeleton";
import { Card } from "@/components/ui/card";
import { useState, useMemo } from "react";

export const TabAvailableRaces = ({
  carId,
  currentCar,
}: {
  carId?: string;
  currentCar?: Car;
}) => {
  const { data: availableCars, isFetching } = useCarsToRace(carId || "");
  const [filterByTime, setFilterByTime] = useState(false);

  const filteredCars = useMemo(() => {
    if (!filterByTime || !currentCar || !availableCars) return availableCars;

    return availableCars.filter((car) => {
      // Check 0-400 time if both cars have it
      if (currentCar["0_400"] && car["0_400"]) {
        const diff = Math.abs(currentCar["0_400"] - car["0_400"]);
        if (diff <= 2) return true;
      }

      // Check 0-350 time if both cars have it
      if (currentCar["0_350"] && car["0_350"]) {
        const diff = Math.abs(currentCar["0_350"] - car["0_350"]);
        if (diff <= 2) return true;
      }

      return false;
    });
  }, [filterByTime, currentCar, availableCars]);

  return (
    <TabsContent value="available-races" className="space-y-4 mt-4">
      <p className="text-gray-500 text-sm mt-4">
        List of cars that are available to race with this car (cars that haven't
        competed in the same events).
      </p>

      {currentCar && (currentCar["0_350"] || currentCar["0_400"]) && (
        <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={filterByTime}
              onChange={(e) => setFilterByTime(e.target.checked)}
              className="w-4 h-4 rounded border-gray-300"
            />
            <span className="text-sm text-gray-700">
              Filter cars within ±2s of current car's 0-350 or 0-400 time
            </span>
          </label>
        </div>
      )}

      {isFetching ? (
        <div className="flex flex-col gap-2">
          {new Array(5).fill(1).map((_, index) => (
            <Skeleton key={index} className="h-12 w-full" />
          ))}
        </div>
      ) : !filteredCars || filteredCars.length === 0 ? (
        <Card className="p-4 text-center text-gray-500">
          {filterByTime
            ? "No cars match the time filter criteria."
            : "No cars available to race with this car."}
        </Card>
      ) : (
        <div className="flex flex-col gap-2">
          {filteredCars.map((car) => (
            <Card
              key={car.id}
              className="p-4 hover:bg-gray-50 transition-colors cursor-pointer"
            >
              <div className="flex flex-col gap-2">
                <div className="flex items-center justify-between">
                  <span className="font-medium text-gray-700">{car.name}</span>
                  <span className="text-xs text-gray-500 uppercase px-2 py-1 bg-gray-100 rounded">
                    {car.class}
                  </span>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-sm text-gray-600">
                  {car.hp && (
                    <div>
                      <span className="font-semibold">{car.hp}</span> HP
                    </div>
                  )}
                  {car.nm && (
                    <div>
                      <span className="font-semibold">{car.nm}</span> Nm
                    </div>
                  )}
                  {car.kg && (
                    <div>
                      <span className="font-semibold">{car.kg}</span> kg
                    </div>
                  )}
                  <div></div>
                  {car["0_100"] && (
                    <div className="flex flex-row gap-2">
                      <span>0-100</span>
                      <span className="font-semibold">{car["0_100"]}</span>s
                    </div>
                  )}
                  {car["0_200"] && (
                    <div className="flex flex-row gap-2">
                      <span>0-200</span>
                      <span className="font-semibold">{car["0_200"]}</span>s
                    </div>
                  )}
                  {car["0_300"] && (
                    <div className="flex flex-row gap-2">
                      <span>0-300</span>
                      <span className="font-semibold">{car["0_300"]}</span>s
                    </div>
                  )}
                  {car["0_350"] && (
                    <div className="flex flex-row gap-2">
                      <span>0-350</span>
                      <span className="font-semibold">{car["0_350"]}</span>s
                    </div>
                  )}
                  {car["0_400"] && (
                    <div className="flex flex-row gap-2">
                      <span>0-400</span>
                      <span className="font-semibold">{car["0_400"]}</span>s
                    </div>
                  )}
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}
    </TabsContent>
  );
};
