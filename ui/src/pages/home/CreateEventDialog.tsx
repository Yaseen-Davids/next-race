import { FC, useContext, useMemo } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Form } from "react-final-form";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { LoadingSpinner } from "@/components/LoadingSpinner";
import { TextCombo } from "@/components/form/ComboField";
import { DateField } from "@/components/form/DateField";
import { SubmissionErrors } from "final-form";
import { UserContext } from "@/contexts/UserContext";
import { SelectField } from "@/components/form/SelectField";
import { SwitchField } from "@/components/form/SwitchField";
import {
  useEventsApi,
  useEventsWithCars,
  useNextEvents,
} from "@/lib/api/events";
import { useCarsApi } from "@/lib/api/cars";
import { format } from "date-fns";
import { Skeleton } from "@/components/ui/skeleton";

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

  const { mutateAsync: upsertEvent } = useNextEvents();
  const { mutateAsync: removeEvent } = useEventsApi.useRemove();

  const { data: eventData, isFetching: fetchingEvent } = useEventsWithCars(
    eventId!
  );
  const { data, isFetching } = useCarsApi.useAll();

  const allCars = useMemo(
    () =>
      (data || [])
        .map((d) => ({
          value: d.id,
          label: d.name,
        }))
        .sort((a, b) => a.label.localeCompare(b.label)),
    [data]
  );

  const event = useMemo(() => {
    if (fetchingEvent || !eventId) return undefined;
    const { cars, ...rest } = eventData![0];
    const [car1, car2, car3] = cars;
    return { ...rest, car1, car2, car3 };
  }, [fetchingEvent, eventData, eventId]);

  const handleRemoveEvent = async (eventId: string) => {
    await removeEvent({ id: eventId });
    queryClient.invalidateQueries({
      queryKey: ["events"],
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
        {fetchingEvent ? (
          <div className="flex flex-col gap-6">
            {new Array(6).fill(1).map((_, i) => (
              <div className="flex flex-col gap-2" key={i}>
                <Skeleton className="h-6 w-60" />
                <Skeleton className="h-8" />
              </div>
            ))}
            <div className="flex flex-col gap-2">
              <Skeleton className="h-8" />
              <Skeleton className="h-8" />
            </div>
          </div>
        ) : (
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
                const { car1, car2, car3, ...rest } = values;
                await upsertEvent({
                  ...rest,
                  date: format(values.date, "yyyy-MM-dd"),
                  user_id: user?.id,
                  cars: [car1.value, car2.value, car3.value].filter(Boolean),
                });
                queryClient.invalidateQueries({ queryKey: ["events"] });
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
                    className="flex w-full justify-center bg-transparent hover:bg-red-200 border border-red-200 text-red-600"
                    onClick={() => handleRemoveEvent(eventId)}
                  >
                    Delete
                  </Button>
                )}
              </form>
            )}
          />
        )}
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
        data={cars}
        isFetching={loadingCars}
      />
      <TextCombo
        required
        field="car3"
        label="Available AI Car"
        data={cars}
        isFetching={loadingCars}
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
          className="flex w-full justify-center bg-emerald-100 hover:bg-emerald-200"
        >
          {submitting ? <LoadingSpinner size="xs" isButton /> : "Save"}
        </Button>
      </div>
    </>
  );
};
