import { TextField } from "@/components/form/TextField";
import { TabsContent } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { useCarsApi } from "@/lib/api/cars";
import { useMemo } from "react";
import { useFormState } from "react-final-form";

export const TabYoutube = () => {
  return (
    <TabsContent value="youtube" className="space-y-4">
      <p className="text-gray-500 text-sm mt-4">
        Manage the YouTube metadata for this event, including title,
        description, and comments.
      </p>
      <TextField multiline label="Comment" field="comment" />
      <VideoDetails />
    </TabsContent>
  );
};

const useHashTag = (name: string) =>
  `#${(name ?? "").toLowerCase().replace(/[\s]/g, "")}`;

const VideoDetails = () => {
  const { data: carsData, isFetching: fetchingCars } = useCarsApi.useAll();

  const state = useFormState();

  const title = useMemo(() => {
    return new Array(3)
      .fill(1)
      .reduce((acc, _, i) => {
        const car = state.values[`car${i + 1}`];
        if (car) {
          const hasNext = state.values[`car${i + 2}`];
          acc.push(`${car.label} ${hasNext ? "vs" : "DRAG RACE"}`);
        }
        return acc;
      }, [])
      .join(" ");
  }, [state.values]);

  const description = useMemo(() => {
    return new Array(3)
      .fill(1)
      .reduce((acc, _, i) => {
        const car = state.values[`car${i + 1}`];
        if (car) {
          acc.push(useHashTag(car.label));
        }
        return acc;
      }, [])
      .join(" ");
  }, [state.values]);

  const speed = useMemo(() => {
    if (fetchingCars) return [];

    const { car1, car2, car3 } = state.values;

    return [car1, car2, car3].reduce((arr, acc) => {
      if (!acc || !acc.value) return arr;

      const spec = carsData?.find((carD) => carD.id === acc.value);
      if (spec) {
        arr.push([
          spec["name"],
          spec["0_100"],
          spec["0_200"],
          spec["0_300"],
          spec["0_350"],
          spec["0_400"],
        ]);
      }
      return arr;
    }, []);
  }, [state.values, fetchingCars, carsData]);

  const specsList: Array<{ name: string; text: string }> = useMemo(() => {
    if (fetchingCars) return [];

    const { car1, car2, car3 } = state.values;

    return [car1, car2, car3].reduce((arr, acc) => {
      if (!acc || !acc.value) return arr;

      const spec = carsData?.find((carD) => carD.id === acc.value);
      if (spec) {
        arr.push({
          name: spec.name,
          text: [
            spec["name"],
            `${spec["hp"] ?? "-"} Hp`,
            `${spec["nm"] ?? "-"} Nm`,
            `${spec["kg"] ?? "-"} Kg`,
          ].join("\n"),
        });
      }
      return arr;
    }, []);
  }, [state.values, fetchingCars, carsData]);

  return (
    <>
      <div>
        <div className="flex flex-row gap-2 items-center">
          <label className="block text-sm/6 font-medium text-gray-900">
            Title
          </label>
        </div>
        <div className="mt-1">
          <Textarea
            rows={1}
            defaultValue={title}
            placeholder="Select cars to use this title"
            className="w-full placeholder:text-sm"
          />
        </div>
      </div>
      <div>
        <div className="flex flex-row gap-2 items-center">
          <label className="block text-sm/6 font-medium text-gray-900">
            Description
          </label>
        </div>
        <div className="mt-1">
          <Textarea
            rows={1}
            defaultValue={description}
            placeholder="Select cars to use this description"
            className="w-full placeholder:text-sm"
          />
        </div>
      </div>
      <div>
        <div className="flex flex-row gap-2 items-center">
          <label className="block text-sm/6 font-medium text-gray-900">
            Speed
          </label>
        </div>
        <div className="mt-1">
          <Textarea
            rows={3}
            defaultValue={JSON.stringify(speed)}
            placeholder="Select cars to use this description"
            className="w-full placeholder:text-sm"
          />
        </div>
      </div>
      <div>
        <div className="flex flex-row gap-2 items-center">
          <label className="block text-sm/6 font-medium text-gray-900">
            Specs
          </label>
        </div>
        <div className="grid grid-cols-2 gap-4">
          {specsList.length === 0 && (
            <Textarea
              rows={3}
              defaultValue={""}
              placeholder="Select cars to use this description"
              className="w-full placeholder:text-sm"
            />
          )}
          {specsList.map((s, idx) => (
            <div key={`spec-${idx}`} className="flex gap-2 items-start">
              <div className="flex-1">
                <Textarea
                  rows={4}
                  defaultValue={s.text}
                  placeholder={`Specs for ${s.name}`}
                  className="w-full placeholder:text-sm"
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
};
