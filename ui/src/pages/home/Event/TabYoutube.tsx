import { TextField } from "@/components/form/TextField";
import { TabsContent } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
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

  return (
    <>
      <div>
        <div className="flex flex-row gap-2 items-center">
          <label className="block text-sm/6 font-medium text-gray-900">
            Title
          </label>
          {/* <Button
            type="button"
            variant="ghost"
            className="p-0 h-5 w-10 px-2 py-1"
          >
            <CopyIcon />
          </Button> */}
        </div>
        <div className="mt-1">
          <Textarea
            rows={3}
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
          {/* <Button
            type="button"
            variant="ghost"
            className="p-0 h-5 w-10 px-2 py-1"
          >
            <CopyIcon />
          </Button> */}
        </div>
        <div className="mt-1">
          <Textarea
            rows={3}
            defaultValue={description}
            placeholder="Select cars to use this description"
            className="w-full placeholder:text-sm"
          />
        </div>
      </div>
    </>
  );
};
