import { FC } from "react";
import { Form } from "react-final-form";
import { useNavigate } from "react-router-dom";
import { TextField } from "@/components/form/TextField";
import { LoadingSpinner } from "@/components/LoadingSpinner";
import { useLogin } from "@/lib/api/user";
import { useQueryClient } from "@tanstack/react-query";

type Props = {};

export const Login: FC<Props> = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { mutateAsync } = useLogin();

  return (
    <div className="bg-gray-100/50 h-[100dvh]">
      <div className="flex min-h-full flex-1 flex-col justify-center sm:px-6 lg:px-8">
        <div className="sm:mx-auto sm:w-full sm:max-w-md">
          <h2 className="text-center text-2xl/9 font-bold tracking-tight text-gray-800">
            Sign in
          </h2>
        </div>
        <div className="sm:mx-auto sm:w-full sm:max-w-[480px] mt-4">
          <div className="bg-white px-6 py-12 sm:rounded-lg sm:px-12 shadow">
            <Form
              initialValues={{
                username: "",
                password: "",
              }}
              onSubmit={async (values) => {
                try {
                  const resp = await mutateAsync({ ...values });
                  if (resp.data.token) {
                    localStorage.setItem("sessionToken", resp.data.token);
                    queryClient.invalidateQueries({ queryKey: ["whoami"] });
                    navigate("/");
                  } else {
                    throw new Error("No token generated!");
                  }
                } catch (error) {
                  return { login: "Login failed" };
                }
              }}
              render={({ handleSubmit, submitErrors, submitting }) => (
                <form onSubmit={handleSubmit} className="space-y-6">
                  <TextField
                    field="username"
                    label="Username"
                    placeholder="Your username"
                    required
                  />
                  <TextField
                    required
                    field="password"
                    label="Password"
                    placeholder="Your password"
                    type="password"
                  />
                  {submitErrors && (
                    <div className="text-red-600 text-sm w-full">
                      {submitErrors.login}
                    </div>
                  )}
                  <div className="flex items-center justify-start">
                    <div className="text-sm/6">
                      <a
                        href="/forgot-password"
                        className="font-semibold text-red-600 hover:text-red-500"
                      >
                        Forgot password?
                      </a>
                    </div>
                  </div>
                  <div>
                    <button
                      type="submit"
                      disabled={submitting}
                      className="flex w-full justify-center rounded-md bg-red-600 px-3 py-1.5 text-sm/6 font-semibold text-white shadow-sm hover:bg-red-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red-600"
                    >
                      {submitting ? (
                        <LoadingSpinner size="xs" isButton />
                      ) : (
                        "Sign in"
                      )}
                    </button>
                  </div>
                </form>
              )}
            />
            <div>
              <div className="relative mt-8">
                <div
                  aria-hidden="true"
                  className="absolute inset-0 flex items-center"
                >
                  <div className="w-full border-t border-gray-200" />
                </div>
                <div className="relative flex justify-center text-sm/6 font-medium">
                  <span className="bg-white px-6 text-gray-900">
                    Or continue with
                  </span>
                </div>
              </div>
            </div>
          </div>
          <div className="mt-6 mb-6">
            <p className="text-center text-sm/6 text-gray-700">
              Not a member?{" "}
              <button
                type="button"
                className="font-semibold text-red-600 hover:text-red-500"
                onClick={() => navigate("/sign-up")}
              >
                Sign up
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
