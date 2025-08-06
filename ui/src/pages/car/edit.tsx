import { FC, useContext } from "react";
import { Form } from "react-final-form";
import { useNavigate, useParams } from "react-router-dom";
import { TextField } from "@/components/form/TextField";
import { LoadingSpinner } from "@/components/LoadingSpinner";
import { Car } from "@/lib/types";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { UserContext } from "@/contexts/UserContext";
import { SelectField } from "@/components/form/SelectField";
import { useCarsApi } from "@/lib/api/cars";

type Props = {};

export const CarEdit: FC<Props> = () => {
  const navigate = useNavigate();
  const params = useParams();
  const { user } = useContext(UserContext);

  const { data, isFetching } = useCarsApi.useSingle(params.id);
  const { mutateAsync } = useCarsApi.useUpsert();

  if (isFetching) return <LoadingSpinner />;

  return (
    <div>
      <div className="flex min-h-full flex-1 flex-col justify-center py-12 sm:px-6 lg:px-8">
        <div className="sm:mx-auto sm:w-full sm:max-w-md">
          <h2 className="mt-6 text-center text-2xl/9 font-bold tracking-tight text-gray-700">
            {params.id ? "Edit" : "Create"} Vehicle
          </h2>
        </div>
        <div className="sm:mx-auto sm:w-full sm:max-w-[480px]">
          <div className="px-6 py-12 sm:rounded-lg sm:px-12">
            <Form
              initialValues={{
                id: data?.id || "",
                name: data?.name || "",
                class: data?.class || "",
              }}
              onSubmit={async (values: Partial<Car>) => {
                try {
                  const resp = await mutateAsync({
                    id: values.id,
                    data: {
                      class: values.class,
                      name: values.name,
                      user_id: user?.id,
                    },
                  });
                  toast.success("Car successfully submitted!");
                  navigate(`/car/${resp.data}`);
                } catch (error) {
                  return { body: "Something went wrong. Please try again" };
                }
              }}
              render={({ handleSubmit, submitErrors, submitting }) => (
                <form onSubmit={handleSubmit} className="space-y-6">
                  <TextField field="name" label="Name" required />
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
                  <div>
                    <Button
                      type="submit"
                      variant="secondary"
                      disabled={submitting}
                      className="flex w-full justify-center"
                    >
                      {submitting ? (
                        <LoadingSpinner size="xs" isButton />
                      ) : (
                        "Save"
                      )}
                    </Button>
                  </div>
                </form>
              )}
            />
          </div>
        </div>
      </div>
    </div>
  );
};
