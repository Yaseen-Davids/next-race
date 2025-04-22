import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.tsx";
import "./index.css";

import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { UserProvider } from "./contexts/UserContext.tsx";
import ProtectedRoute from "./components/ProtectedRoute.tsx";
import { Login } from "./pages/user/login.tsx";
import { Register } from "./pages/user/register.tsx";
import { CarEdit } from "./pages/car/edit.tsx";
import { Toaster } from "@/components/ui/sonner";
// import { ThemeProvider } from "./components/theme-provider.tsx";

const queryClient = new QueryClient();

const router = createBrowserRouter([
  {
    path: "/login",
    element: <Login />,
  },
  {
    path: "/register",
    element: <Register />,
  },
  {
    path: "/",
    element: <ProtectedRoute />,
    children: [
      {
        path: "/",
        element: <App />,
      },
      {
        path: "/car/:id?",
        element: <CarEdit />,
      },
    ],
  },
]);

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <UserProvider>
        {/* <ThemeProvider defaultTheme="dark" storageKey="app-theme"> */}
        <RouterProvider router={router} />
        <Toaster />
        {/* </ThemeProvider> */}
      </UserProvider>
    </QueryClientProvider>
  </React.StrictMode>
);
