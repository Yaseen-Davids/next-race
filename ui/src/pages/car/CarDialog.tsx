import { FC, useContext } from "react";
import { LoadingSpinner } from "@/components/LoadingSpinner";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { UserContext } from "@/contexts/UserContext";
import { Car, useCarsApi } from "@/lib/api/cars";
import { useQueryClient } from "@tanstack/react-query";
import { Form } from "react-final-form";
import { toast } from "sonner";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Car as CarIcon, Pencil, SaveIcon, Trash } from "lucide-react";
import { TabDetails } from "./Car/TabDetails";
import { TabSpecifications } from "./Car/TabSpecifications";

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
    <Sheet open onOpenChange={handleClose}>
      <SheetContent className="min-w-[100dvw] sm:min-w-[50dvw] h-full overflow-y-auto p-0 border-0">
        <SheetHeader className="flex flex-row items-center p-3 px-6">
          <SheetTitle className="text-xl text-gray-700">
            {!carId || carId === ""
              ? "Add a new car"
              : `Update ${data?.name || ""}`}
          </SheetTitle>
          <SheetClose />
        </SheetHeader>
        <div className="p-3 px-6">
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
                ...data,
                class: data?.class.toLowerCase() || "road",
              }}
              onSubmit={async (values: Partial<Car>) => {
                console.log("🚀 ~ CarDialog ~ values:", values);
                try {
                  await mutateAsync({
                    id: carId,
                    data: {
                      class: values.class,
                      name: values.name,
                      hp: values.hp,
                      nm: values.nm,
                      kg: values.kg,
                      "0_100": values["0_100"],
                      "0_200": values["0_200"],
                      "0_250": values["0_250"],
                      "0_300": values["0_300"],
                      "0_350": values["0_350"],
                      "0_400": values["0_400"],
                      "0_500": values["0_500"],
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
                  <Tabs defaultValue="details" className="">
                    <TabsList>
                      <TabsTrigger
                        value="details"
                        className="flex flex-row gap-2"
                      >
                        <CarIcon className="w-3 h-3" />
                        Details
                      </TabsTrigger>
                      <TabsTrigger
                        value="specifications"
                        className="flex flex-row gap-2"
                      >
                        <Pencil className="w-3 h-3" />
                        Specifications
                      </TabsTrigger>
                    </TabsList>
                    <TabDetails />
                    <TabSpecifications />
                  </Tabs>
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
                        <>
                          <SaveIcon />
                          Save
                        </>
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
                        <Trash />
                        Delete
                      </Button>
                    )}
                  </div>
                </form>
              )}
            />
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
};
