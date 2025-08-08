import { Navigate, Outlet } from "react-router-dom";
import { whoami } from "../contexts/UserContext";
import { useEffect, useState } from "react";
import { Navbar } from "@/navbar";
import { LoadingSpinner } from "./LoadingSpinner";

const ProtectedRoute = () => {
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);

  useEffect(() => {
    whoami().then((resp) => {
      setUser(resp);
      setLoading(false);
    });
  }, []);

  if (loading)
    return (
      <>
        <Navbar />
        <div>
          <LoadingSpinner />
        </div>
      </>
    );

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return (
    <>
      <Navbar />
      <Outlet />
    </>
  );
};

export default ProtectedRoute;
