import { FC } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "./components/ui/button";
import { useQueryClient } from "@tanstack/react-query";

type NavbarProps = {};

export const Navbar: FC<NavbarProps> = ({}) => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const logout = async () => {
    await axios.get("/api/logout");
    queryClient.invalidateQueries({ queryKey: ["whoami"] });
    navigate("/login");
  };

  return (
    <div className="flex flex-row w-full bg-red-900 items-center justify-between py-2 px-4">
      <Link to="/" className="font-bold text-white text-xl">
        [INFIN8]'s Garage
      </Link>
      <Button className="border text-white" variant={"ghost"} onClick={logout}>
        Log out
      </Button>
    </div>
  );
};
