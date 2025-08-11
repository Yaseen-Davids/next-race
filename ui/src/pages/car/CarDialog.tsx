import { FC, useContext } from "react";
import { SelectField } from "@/components/form/SelectField";
import { TextField } from "@/components/form/TextField";
import { LoadingSpinner } from "@/components/LoadingSpinner";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { UserContext } from "@/contexts/UserContext";
import { Car, useCarsApi } from "@/lib/api/cars";
import { useQueryClient } from "@tanstack/react-query";
import { Form } from "react-final-form";
import { toast } from "sonner";
import { Skeleton } from "@/components/ui/skeleton";

type CarDialogProps = {
  carId?: string;
  handleClose(): void;
};

export const CarDialog: FC<CarDialogProps> = ({ carId, handleClose }) => {
  const queryClient = useQueryClient();
  const { user } = useContext(UserContext);

  const { data, isFetching } = useCarsApi.useSingle(carId);
  const { mutateAsync } = useCarsApi.useUpsert();
  const { mutateAsync: deleteCar, isLoading } = useCarsApi.useRemove();

  const handleRemoveCar = async () => {
    await deleteCar({ id: carId! });
    queryClient.invalidateQueries({ queryKey: ["cars"] });
    toast.success("Car successfully removed!");
    handleClose();
  };

  return (
    <Dialog open onOpenChange={handleClose}>
      <DialogContent className="">
        <DialogHeader className="flex flex-row items-center gap-4">
          <DialogTitle>
            {!carId || carId === ""
              ? "Add a new car"
              : `Update ${data?.name || ""}`}
          </DialogTitle>
        </DialogHeader>
        {isFetching ? (
          <div className="flex flex-col gap-6">
            {new Array(2).fill(1).map(() => (
              <div className="flex flex-col gap-2">
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
            initialValues={{
              id: data?.id || "",
              name: data?.name || "",
              class: data?.class.toLowerCase() || "road",
            }}
            onSubmit={async (values: Partial<Car>) => {
              try {
                await mutateAsync({
                  id: carId,
                  data: {
                    class: values.class,
                    name: values.name,
                    user_id: user?.id,
                  },
                });
                queryClient.invalidateQueries({ queryKey: ["cars"] });
                toast.success("Car successfully submitted!");
                handleClose();
              } catch (error) {
                return { body: "Something went wrong. Please try again" };
              }
            }}
            render={({ handleSubmit, submitErrors, submitting }) => (
              <form onSubmit={handleSubmit} className="space-y-6">
                <TextField
                  field="name"
                  label="Name"
                  placeholder="e.g Bugatti Chiron"
                  required
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
                {submitErrors && (
                  <div className="text-red-600 text-sm w-full">
                    {submitErrors.body}
                  </div>
                )}
                <div className="flex flex-col gap-4">
                  <Button
                    type="submit"
                    variant="secondary"
                    disabled={submitting}
                    className="flex w-full justify-center bg-emerald-100 hover:bg-emerald-200"
                  >
                    {submitting ? (
                      <LoadingSpinner size="xs" isButton />
                    ) : (
                      "Save"
                    )}
                  </Button>
                  {carId && (
                    <Button
                      type="button"
                      variant="secondary"
                      disabled={isLoading}
                      onClick={handleRemoveCar}
                      className="flex w-full justify-center bg-transparent hover:bg-red-200 border border-red-200 text-red-600"
                    >
                      Delete
                    </Button>
                  )}
                </div>
              </form>
            )}
          />
        )}
      </DialogContent>
    </Dialog>
  );
};
