import { FC, useContext, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Form } from "react-final-form";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { LoadingSpinner } from "@/components/LoadingSpinner";
import { UserContext } from "@/contexts/UserContext";
import {
  useEventsApi,
  useEventsWithCars,
  useNextEvents,
} from "@/lib/api/events";
import { format } from "date-fns";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Calendar, CopyIcon, Pencil, SaveIcon, Trash } from "lucide-react";
import { TabEvent } from "./TabEvent";
import { TabYoutube } from "./TabYoutube";

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

  const handleDuplicateEvent = async () => {
    const values = (eventData || [])[0];

    if (!values) {
      toast.error("No event selected");
    }

    await upsertEvent({
      user_comment: values.user_comment,
      platform: values.platform,
      status: values.status,
      date: values.date,
      user_id: user?.id,
      cars: values.cars.map((c) => c.value),
    });
    queryClient.invalidateQueries({
      queryKey: ["events"],
    });
    toast.success("Event successfully duplicated!");
    handleClose();
  };

  return (
    <Sheet open onOpenChange={handleClose}>
      <SheetContent className="min-w-[100dvw] sm:min-w-[50dvw] h-full overflow-y-auto p-0 border-0">
        <SheetHeader className="flex flex-row items-center p-3 px-6">
          <SheetTitle className="text-xl text-gray-700">Event</SheetTitle>
          <SheetClose />
        </SheetHeader>
        <div className="p-3 px-6">
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
                  <FormDetail />
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
                      className="flex w-full justify-center bg-emerald-100 hover:bg-emerald-200 text-emerald-700"
                    >
                      {submitting ? (
                        <LoadingSpinner size="xs" isButton />
                      ) : (
                        <>
                          <SaveIcon />
                          Save
                        </>
                      )}
                    </Button>
                  </div>
                  {eventId && (
                    <div className="grid grid-cols-2 gap-2">
                      <Button
                        type="button"
                        variant={"ghost"}
                        className="flex w-full justify-center bg-transparent hover:bg-blue-200 border border-blue-200 text-blue-600 hover:text-blue-700"
                        onClick={() => handleDuplicateEvent()}
                      >
                        <CopyIcon />
                        <span>Duplicate</span>
                      </Button>
                      <Button
                        type="button"
                        variant={"destructive"}
                        className="flex w-full justify-center bg-transparent hover:bg-red-200 border border-red-200 text-red-600"
                        onClick={() => handleRemoveEvent(eventId)}
                      >
                        <Trash />
                        <span>Delete</span>
                      </Button>
                    </div>
                  )}
                </form>
              )}
            />
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
};

type FormDetailProps = {};

const FormDetail: FC<FormDetailProps> = ({}) => {
  return (
    <Tabs defaultValue="event" className="">
      <TabsList>
        <TabsTrigger value="event" className="flex flex-row gap-2">
          <Calendar className="w-3 h-3" />
          Event
        </TabsTrigger>
        <TabsTrigger value="youtube" className="flex flex-row gap-2">
          <Pencil className="w-3 h-3" />
          Youtube
        </TabsTrigger>
      </TabsList>
      <TabEvent />
      <TabYoutube />
    </Tabs>
  );
};
