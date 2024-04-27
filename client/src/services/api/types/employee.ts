

import { PositionEnum } from "./position";

export type Employee = {
  id: number | string;
  email: string;
  firstName: string;
  lastName: string;
  salary: number;
  position: {id: PositionEnum};
};
