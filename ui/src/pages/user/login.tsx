import { FC } from "react";
import axios from "axios";
import { Form } from "react-final-form";
import { useNavigate } from "react-router-dom";
import { TextField } from "@/components/form/TextField";
import { LoadingSpinner } from "@/components/LoadingSpinner";
import { useQueryClient } from "@tanstack/react-query";

type Props = {};

export const Login: FC<Props> = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  return (
    <div>
      <div className="flex min-h-full flex-1 flex-col justify-center py-12 sm:px-6 lg:px-8">
        <div className="sm:mx-auto sm:w-full sm:max-w-md">
          <h2 className="mt-6 text-center text-2xl/9 font-bold tracking-tight text-gray-700">
            Sign in
          </h2>
        </div>
        <div className="sm:mx-auto sm:w-full sm:max-w-[480px]">
          <div className="bg-white px-6 py-12 sm:rounded-lg sm:px-12">
            <Form
              initialValues={{
                username: "",
                password: "",
              }}
              onSubmit={async (values) => {
                try {
                  await axios.post("/api/login", values);
                  queryClient.invalidateQueries({ queryKey: ["whoami"] });
                  navigate("/");
                } catch (error) {
                  return { login: "Login failed" };
                }
              }}
              render={({ handleSubmit, submitErrors, submitting }) => (
                <form onSubmit={handleSubmit} className="space-y-6">
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
                  <div className="flex items-center justify-between">
                    <p className="text-center text-sm/6 text-gray-500">
                      Not a member?{" "}
                      <button
                        type="button"
                        className="font-semibold text-indigo-600 hover:text-indigo-500"
                        onClick={() => navigate("/register")}
                      >
                        Sign up
                      </button>
                    </p>
                    {/* <div className="text-sm/6">
                      <a
                        href="#"
                        className="font-semibold text-indigo-600 hover:text-indigo-500"
                      >
                        Forgot password?
                      </a>
                    </div> */}
                  </div>
                  <div>
                    <button
                      type="submit"
                      disabled={submitting}
                      className="flex w-full justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm/6 font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
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
              <div className="mt-6 grid grid-cols-2 gap-4">
                <a
                  href="/api/user/login/google"
                  className="flex w-full items-center justify-center gap-3 rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus-visible:ring-transparent"
                >
                  <svg
                    viewBox="0 0 24 24"
                    aria-hidden="true"
                    className="h-5 w-5"
                  >
                    <path
                      d="M12.0003 4.75C13.7703 4.75 15.3553 5.36002 16.6053 6.54998L20.0303 3.125C17.9502 1.19 15.2353 0 12.0003 0C7.31028 0 3.25527 2.69 1.28027 6.60998L5.27028 9.70498C6.21525 6.86002 8.87028 4.75 12.0003 4.75Z"
                      fill="#EA4335"
                    />
                    <path
                      d="M23.49 12.275C23.49 11.49 23.415 10.73 23.3 10H12V14.51H18.47C18.18 15.99 17.34 17.25 16.08 18.1L19.945 21.1C22.2 19.01 23.49 15.92 23.49 12.275Z"
                      fill="#4285F4"
                    />
                    <path
                      d="M5.26498 14.2949C5.02498 13.5699 4.88501 12.7999 4.88501 11.9999C4.88501 11.1999 5.01998 10.4299 5.26498 9.7049L1.275 6.60986C0.46 8.22986 0 10.0599 0 11.9999C0 13.9399 0.46 15.7699 1.28 17.3899L5.26498 14.2949Z"
                      fill="#FBBC05"
                    />
                    <path
                      d="M12.0004 24.0001C15.2404 24.0001 17.9654 22.935 19.9454 21.095L16.0804 18.095C15.0054 18.82 13.6204 19.245 12.0004 19.245C8.8704 19.245 6.21537 17.135 5.2654 14.29L1.27539 17.385C3.25539 21.31 7.3104 24.0001 12.0004 24.0001Z"
                      fill="#34A853"
                    />
                  </svg>
                  <span className="text-sm/6 font-semibold">Google</span>
                </a>
                <a
                  href="/api/user/login/facebook"
                  className="flex w-full items-center justify-center gap-3 rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus-visible:ring-transparent"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 48 48"
                    className="h-6 w-6"
                  >
                    <path
                      fill="#039be5"
                      d="M24 5A19 19 0 1 0 24 43A19 19 0 1 0 24 5Z"
                    />
                    <path
                      fill="#fff"
                      d="M26.572,29.036h4.917l0.772-4.995h-5.69v-2.73c0-2.075,0.678-3.915,2.619-3.915h3.119v-4.359c-0.548-0.074-1.707-0.236-3.897-0.236c-4.573,0-7.254,2.415-7.254,7.917v3.323h-4.701v4.995h4.701v13.729C22.089,42.905,23.032,43,24,43c0.875,0,1.729-0.08,2.572-0.194V29.036z"
                    />
                  </svg>
                  <span className="text-sm/6 font-semibold">Facebook</span>
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
