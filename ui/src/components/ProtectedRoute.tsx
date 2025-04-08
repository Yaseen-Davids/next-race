import { Navigate, Outlet } from "react-router-dom";
import { whoami } from "../contexts/UserContext";
import { useEffect, useState } from "react";

const ProtectedRoute = () => {
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);

  useEffect(() => {
    whoami().then((resp) => {
      setUser(resp);
      setLoading(false);
    });
  }, []);

  if (loading) return <p>Loading...</p>;

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
};

export default ProtectedRoute;
