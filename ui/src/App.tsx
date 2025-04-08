import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useQueryClient } from "@tanstack/react-query";

function App() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const logout = async () => {
    await axios.get("/api/logout");
    queryClient.invalidateQueries({ queryKey: ["whoami"] });
    navigate("/login");
  };

  return (
    <div>
      <button onClick={logout}>logout</button>
    </div>
  );
}

export default App;
