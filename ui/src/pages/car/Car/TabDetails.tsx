import { SelectField } from "@/components/form/SelectField";
import { TextField } from "@/components/form/TextField";
import { TabsContent } from "@radix-ui/react-tabs";

export const TabDetails = () => {
  return (
    <TabsContent value="details" className="space-y-4 mt-4">
      <p className="text-gray-500 text-sm mt-4">
        Basic information about the car such as name and class.
      </p>
      <TextField
        required
        autoFocus
        field="name"
        label="Name"
        placeholder="e.g Bugatti Chiron"
      />
      <SelectField
        field="class"
        label="Class"
        data={[
          { label: "Road", value: "road" },
          { label: "Supercar", value: "supercar" },
          { label: "Hypercar", value: "hypercar" },
        ]}
      />
    </TabsContent>
  );
};
