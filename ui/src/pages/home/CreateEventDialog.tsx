import { FC } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Form } from "react-final-form";
import { useMutation, useQuery } from "@tanstack/react-query";
import axios, { AxiosResponse } from "axios";
import { toast } from "sonner";
import { LoadingSpinner } from "@/components/LoadingSpinner";
import { TextCombo } from "@/components/form/ComboField";
import { DateField } from "@/components/form/DateField";
import { Car } from "@/lib/types";

type CreateEventDialogProps = {
  date: Date;
  handleClose(): void;
};

export const CreateEventDialog: FC<CreateEventDialogProps> = ({
  date,
  handleClose,
}) => {
  const { data } = useQuery<AxiosResponse<Car[]>>({
    queryKey: ["cars"],
    queryFn: () => axios.get("/api/cars/"),
  });

  // const { mutateAsync } = useMutation({
  //   mutationKey: ["create-event"],
  //   mutationFn: (values) => axios.post("/api/events/new-event", values),
  // });

  return (
    <Dialog open onOpenChange={() => handleClose()}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Create Event</DialogTitle>
          <DialogDescription>
            Create an event by selecting cars to use in a race
          </DialogDescription>
        </DialogHeader>
        <Form
          initialValues={{
            date,
            type: "video",
            platform: "youtube",
            status: "new",
          }}
          onSubmit={async (values) => {
            try {
              // const resp = await mutateAsync({
              //   id: values.id,
              //   class: values.class!,
              //   name: values.name!,
              // });
              toast.success("Event successfully created!");
            } catch (error) {
              return { body: "Something went wrong. Please try again" };
            }
          }}
          render={({ handleSubmit, submitErrors, submitting }) => (
            <form onSubmit={handleSubmit} className="space-y-4">
              <DateField field="date" label="Date" placeholder="Pick a date" />
              <TextCombo
                field="car1"
                label="Your car"
                data={(data?.data || []).map((d: Car) => ({
                  value: d.id!,
                  label: d.name,
                }))}
              />
              <TextCombo
                field="car2"
                label="Available AI Car"
                data={(data?.data || []).map((d: Car) => ({
                  value: d.id!,
                  label: d.name,
                }))}
              />
              <TextCombo
                field="type"
                label="Type"
                data={[
                  { label: "Video", value: "video" },
                  { label: "Short", value: "short" },
                  { label: "Reel", value: "reel" },
                  { label: "TikTok", value: "tiktok" },
                ]}
              />
              <TextCombo
                field="platform"
                label="Platform"
                data={[
                  { label: "YouTube", value: "youtube" },
                  { label: "YouTube Shorts", value: "youtube-shorts" },
                  { label: "TikTok", value: "tiktok" },
                  { label: "Instagram", value: "instagram" },
                ]}
              />
              <TextCombo
                field="status"
                label="Status"
                data={[
                  { label: "New", value: "new" },
                  { label: "Recorded", value: "recorded" },
                  { label: "Edited", value: "edited" },
                  { label: "Done", value: "done" },
                ]}
              />
              {submitErrors && (
                <div className="text-red-600 text-sm w-full">
                  {submitErrors.body}
                </div>
              )}
              <div>
                <Button
                  type="submit"
                  variant="secondary"
                  disabled={submitting}
                  className="flex w-full justify-center ho"
                >
                  {submitting ? <LoadingSpinner size="xs" isButton /> : "Save"}
                </Button>
              </div>
            </form>
          )}
        />
      </DialogContent>
    </Dialog>
  );
};
