import { FC, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useCarsApi } from "@/lib/api/cars";
import { Button } from "@/components/ui/button";
import { CarDialog } from "./CarDialog";

type Props = {};

export const Cars: FC<Props> = () => {
  const navigate = useNavigate();

  const [carId, setCarId] = useState<string | undefined>(undefined);
  const [toggleCarEdit, setToggleCarEdit] = useState<boolean>(false);

  const { data: cars } = useCarsApi.useAll();

  return (
    <div className="p-4 flex flex-col gap-4">
      {(carId || toggleCarEdit) && (
        <CarDialog
          carId={carId}
          handleClose={() => {
            setCarId(undefined);
            setToggleCarEdit(false);
          }}
        />
      )}
      <div className="flex flex-row justify-between">
        <h2
          className="flex flex-row gap-4 items-center group cursor-pointer"
          onClick={() => navigate("/")}
        >
          <ArrowLeft className="transform transition-transform translate-x-2 ease-in duration-200 group-hover:translate-x-0" />
          <span className="text-xl font-bold">Home</span>
        </h2>
        <Button
          variant="outline"
          className=""
          onClick={() => setToggleCarEdit(true)}
        >
          Add
        </Button>
      </div>
      <div>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Class</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {cars
              ?.sort((a, b) => a.name.localeCompare(b.name))
              .map((car) => (
                <TableRow
                  key={car.id}
                  onClick={() => setCarId(car.id)}
                  className="cursor-pointer"
                >
                  <TableCell>{car.name}</TableCell>
                  <TableCell className="capitalize">{car.class}</TableCell>
                </TableRow>
              ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};
