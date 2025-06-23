import { FC, useContext, useMemo } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Form, useForm } from "react-final-form";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import axios, { AxiosResponse } from "axios";
import { toast } from "sonner";
import { LoadingSpinner } from "@/components/LoadingSpinner";
import { TextCombo } from "@/components/form/ComboField";
import { DateField } from "@/components/form/DateField";
import { Car } from "@/lib/types";
import { SubmissionErrors } from "final-form";
import { UserContext } from "@/contexts/UserContext";
import { SelectField } from "@/components/form/SelectField";
import { SwitchField } from "@/components/form/SwitchField";

type CreateEventDialogProps = {
  eventId: string | undefined;
  date: Date | undefined;
  handleClose(): void;
};

export const CreateEventDialog: FC<CreateEventDialogProps> = ({
  date,
  eventId,
  handleClose,
}) => {
  const { user } = useContext(UserContext);
  const queryClient = useQueryClient();

  const { data: eventData, isFetching: fetchingEvent } = useQuery<
    AxiosResponse<any>
  >({
    queryKey: ["event-by-id", eventId],
    queryFn: () => axios.get(`/api/events/byIdWithCars/${eventId}`),
    enabled: !!eventId,
  });

  const { data, isFetching } = useQuery<AxiosResponse<Car[]>>({
    queryKey: ["cars"],
    queryFn: () => axios.get("/api/cars/"),
  });

  const allCars = useMemo(
    () =>
      (data?.data || [])
        .map((d: Car) => ({
          value: d.id!,
          label: d.name,
        }))
        .sort((a, b) => a.label.localeCompare(b.label)),
    [data]
  );

  const { mutateAsync: upsertEvent } = useMutation({
    mutationKey: ["create-event"],
    mutationFn: (values: any) => axios.post("/api/events/new-event", values),
  });

  const { mutateAsync: removeEvent } = useMutation({
    mutationKey: ["create-event"],
    mutationFn: (id: string) => axios.delete(`/api/events/${id}`),
  });

  const event = useMemo(() => {
    if (fetchingEvent || !eventId) return {};
    const { cars, ...rest } = eventData?.data![0];
    const [car1, car2] = cars;
    return { ...rest, car1, car2 };
  }, [eventData, eventId]);

  const handleRemoveEvent = async (eventId: string) => {
    await removeEvent(eventId);
    queryClient.invalidateQueries({
      queryKey: ["events-by-user"],
    });
    toast.success("Event successfully removed!");
    handleClose();
  };

  return (
    <Dialog open onOpenChange={() => handleClose()}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Event</DialogTitle>
        </DialogHeader>
        <Form
          initialValues={
            eventId
              ? event
              : {
                  date,
                  platform: "youtube",
                  status: "new",
                }
          }
          onSubmit={async (values) => {
            try {
              const { car1, car2, ...rest } = values;
              await upsertEvent({
                ...rest,
                user_id: user?.id,
                cars: [car1.value, car2.value],
              });
              queryClient.invalidateQueries({ queryKey: ["events-by-user"] });
              toast.success(`Event ${eventId ? "updated" : "created"}!`);
              handleClose();
            } catch (error) {
              return { body: "Something went wrong. Please try again" };
            }
          }}
          render={({ handleSubmit, submitErrors, submitting }) => (
            <form onSubmit={handleSubmit} className="space-y-4">
              <FormDetail
                cars={allCars}
                loadingCars={isFetching}
                submitting={submitting}
                submitErrors={submitErrors}
              />
              {eventId && (
                <Button
                  variant={"destructive"}
                  className="w-full bg-red-100 hover:bg-red-200 text-red-600"
                  onClick={() => handleRemoveEvent(eventId)}
                >
                  Delete
                </Button>
              )}
            </form>
          )}
        />
      </DialogContent>
    </Dialog>
  );
};

type FormDetailProps = {
  submitting: boolean;
  loadingCars: boolean;
  submitErrors: SubmissionErrors;
  cars: { label: string; value: string }[];
};

const FormDetail: FC<FormDetailProps> = ({
  cars,
  submitErrors,
  submitting,
  loadingCars,
}) => {
  const form = useForm();

  const primaryCarID = useMemo(
    () => form.getState().values.car1,
    [form.getState().values.car1]
  );

  const { data, isFetching } = useQuery<AxiosResponse<Car[]>>({
    queryKey: ["carsToRace", primaryCarID],
    queryFn: () => axios.get(`/api/cars/carsToRace/${primaryCarID.value}`),
    enabled: !!primaryCarID,
  });

  const availableCars = useMemo(
    () =>
      (data?.data || [])
        .map((d: Car) => ({
          value: d.id!,
          label: d.name,
        }))
        .sort((a, b) => a.label.localeCompare(b.label)),
    [data]
  );

  return (
    <>
      <DateField field="date" label="Date" placeholder="Pick a date" />
      <TextCombo
        required
        field="car1"
        label="Primary car"
        data={cars}
        isFetching={loadingCars}
      />
      <TextCombo
        required
        field="car2"
        label="Available AI Car"
        data={availableCars}
        isFetching={isFetching}
      />
      <SwitchField field="user_comment" label="User comment" />
      <SelectField
        field="platform"
        label="Platform"
        data={[
          { label: "YouTube", value: "youtube" },
          { label: "YouTube Shorts", value: "youtube-shorts" },
          { label: "TikTok", value: "tiktok" },
          { label: "Instagram", value: "instagram" },
        ]}
      />
      <SelectField
        field="status"
        label="Status"
        data={[
          { label: "New", value: "new" },
          { label: "Raced", value: "raced" },
          { label: "Recorded", value: "recorded" },
          { label: "Edited", value: "edited" },
          { label: "Done", value: "done" },
        ]}
      />
      {submitErrors && (
        <div className="text-red-600 text-sm w-full">{submitErrors.body}</div>
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
    </>
  );
};
