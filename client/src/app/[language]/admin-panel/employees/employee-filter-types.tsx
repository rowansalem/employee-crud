import { Employee } from "@/services/api/types/employee";
import { SortEnum } from "@/services/api/types/sort-type";

export type EmployeeSortType = {
  orderBy: keyof Employee;
  order: SortEnum;
  
};
