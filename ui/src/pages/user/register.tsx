import axios from "axios";
import { FC } from "react";
import { Form } from "react-final-form";
import { useNavigate } from "react-router-dom";
import { TextField } from "@/components/form/TextField";
import { validateEmail } from "@/lib/utils";
import { LoadingSpinner } from "@/components/LoadingSpinner";
import { useQueryClient } from "@tanstack/react-query";

type Props = {};

export const Register: FC<Props> = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  return (
    <div>
      <div className="flex min-h-full flex-1 flex-col justify-center py-12 sm:px-6 lg:px-8">
        <div className="sm:mx-auto sm:w-full sm:max-w-md">
          {/* <img
            alt="Your Company"
            src="https://tailwindui.com/plus/img/logos/mark.svg?color=indigo&shade=600"
            className="mx-auto h-10 w-auto"
          /> */}
          <h2 className="mt-6 text-center text-2xl/9 font-bold tracking-tight text-gray-700">
            Create your account
          </h2>
        </div>
        <div className="sm:mx-auto sm:w-full sm:max-w-[480px]">
          <div className="bg-white px-6 py-12 sm:rounded-lg sm:px-12">
            <Form
              initialValues={{
                username: "",
                password: "",
                full_name: "",
                email: "",
              }}
              validate={(values) => {
                const errors: { [key: string]: string } = {};

                if ((values.full_name || "").length <= 3) {
                  errors.full_name = "Name too short";
                }

                if ((values.username || "").length <= 3) {
                  errors.username = "Name too short";
                }

                if (
                  (values.email || "").length > 0 &&
                  !validateEmail(values.email)
                ) {
                  errors.email = "Not a valid email address";
                }

                const password = values.password || "";

                if (password.length > 0) {
                  if (password.length < 8) {
                    errors.password = "Password too short";
                  } else {
                    const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).+$/;
                    if (!regex.test(password)) {
                      errors.password =
                        "Password must contain at least one UPPERCASE letter, one LOWERCASE letter, and one NUMBER";
                    }
                  }
                }

                return errors;
              }}
              onSubmit={async (values) => {
                try {
                  await axios.post("/api/sign-up", values);
                  queryClient.invalidateQueries({ queryKey: ["whoami"] });
                  navigate("/");
                } catch (error) {
                  return { login: "Register failed" };
                }
              }}
              render={({ handleSubmit, submitErrors, submitting }) => (
                <form onSubmit={handleSubmit} className="space-y-6">
                  <TextField field="full_name" label="Full Name" required />
                  <TextField field="email" label="Email" required />
                  <TextField field="username" label="Username" required />
                  <TextField
                    required
                    field="password"
                    label="Password"
                    type="password"
                  />
                  {submitErrors && (
                    <div className="text-red-600 text-sm w-full">
                      {submitErrors.login}
                    </div>
                  )}
                  <div className="flex flex-col gap-4">
                    <button
                      type="submit"
                      disabled={submitting}
                      className="flex w-full justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm/6 font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                    >
                      {submitting ? (
                        <LoadingSpinner size="xs" isButton />
                      ) : (
                        "Sign Up"
                      )}
                    </button>
                    <div>
                      <p className="text-center text-sm/6 text-gray-500">
                        Already have an account?{" "}
                        <button
                          type="button"
                          className="font-semibold text-indigo-600 hover:text-indigo-500"
                          onClick={() => navigate("/login")}
                        >
                          Sign in
                        </button>
                      </p>
                    </div>
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
