import { TextField } from "@/components/form/TextField";
import { TabsContent } from "@/components/ui/tabs";

export const TabSpecifications = () => {
  return (
    <TabsContent value="specifications" className="space-y-4 mt-4">
      <p className="text-gray-500 text-sm mt-4">
        Detailed specifications of the car including horsepower, torque, weight,
        and acceleration times.
      </p>
      <div className="grid grid-cols-2 gap-4">
        <div className="col-span-2">
          <h2 className="font-bold text-gray-600 text-xl">Specifications</h2>
        </div>
        <TextField autoFocus field="hp" label="Horsepower" placeholder="" />
        <TextField field="nm" label="Torque (Nm)" placeholder="" />
        <TextField field="kg" label="Weight (kg)" placeholder="" />
        <div></div>
        <div className="col-span-2 mt-6">
          <h2 className="font-bold text-gray-600 text-xl">Acceleration</h2>
        </div>
        <TextField field="0_100" label="0-100 km/h (s)" placeholder="" />
        <TextField field="0_200" label="0-200 km/h (s)" placeholder="" />
        <TextField field="0_250" label="0-250 km/h (s)" placeholder="" />
        <TextField field="0_300" label="0-300 km/h (s)" placeholder="" />
        <TextField field="0_350" label="0-350 km/h (s)" placeholder="" />
        <TextField field="0_400" label="0-400 km/h (s)" placeholder="" />
        <TextField field="0_500" label="0-500 km/h (s)" placeholder="" />
      </div>
    </TabsContent>
  );
};
