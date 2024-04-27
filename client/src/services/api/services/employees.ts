import { useCallback } from "react";
import useFetch from "../use-fetch";
import { API_URL } from "../config";
import wrapperFetchJsonResponse from "../wrapper-fetch-json-response";
import { Employee } from "../types/employee";
import { InfinityPaginationType } from "../types/infinity-pagination";
import { Role } from "../types/role";
import { SortEnum } from "../types/sort-type";
import { RequestConfigType } from "./types/request-config";

export type EmployeesRequest = {
  page: number;
  limit: number;
  sort?: Array<{
    orderBy: keyof Employee;
    order: SortEnum;
  }>;
};

export type EmployeesResponse = InfinityPaginationType<Employee>;

export function useGetEmployeesService() {
  const fetch = useFetch();

  return useCallback(
    (data: EmployeesRequest, requestConfig?: RequestConfigType) => {
      const requestUrl = new URL(`${API_URL}/v1/employees`);
      requestUrl.searchParams.append("page", data.page.toString());
      requestUrl.searchParams.append("limit", data.limit.toString());
      if (data.sort) {
        requestUrl.searchParams.append("sort", JSON.stringify(data.sort));
      }

      return fetch(requestUrl, {
        method: "GET",
        ...requestConfig,
      }).then(wrapperFetchJsonResponse<EmployeesResponse>);
    },
    [fetch]
  );
}

export type EmployeeRequest = {
  id: Employee["id"];
};

export type EmployeeResponse = Employee;

export function useGetEmployeeService() {
  const fetch = useFetch();

  return useCallback(
    (data: EmployeeRequest, requestConfig?: RequestConfigType) => {
      return fetch(`${API_URL}/v1/employees/${data.id}`, {
        method: "GET",
        ...requestConfig,
      }).then(wrapperFetchJsonResponse<EmployeeResponse>);
    },
    [fetch]
  );
}

export type EmployeePostRequest = Pick<Employee, 'email' | 'firstName' | 'lastName' | 'salary' | 'position'>;

export type EmployeePostResponse = Employee;

export function usePostEmployeeService() {
  const fetch = useFetch();

  return useCallback(
    (data: EmployeePostRequest, requestConfig?: RequestConfigType) => {
      return fetch(`${API_URL}/v1/employees`, {
        method: "POST",
        body: JSON.stringify(data),
        ...requestConfig,
      }).then(wrapperFetchJsonResponse<EmployeePostResponse>);
    },
    [fetch]
  );
}

export type EmployeePatchRequest = {
  id: Employee['id'];
  data: Partial<
    Pick<Employee, 'email' | 'firstName' | 'lastName' | 'salary' | 'position'> & {
      password: string;
    }
  >;
};

export type EmployeePatchResponse = Employee;

export function usePatchEmployeeService() {
  const fetch = useFetch();

  return useCallback(
    (data: EmployeePatchRequest, requestConfig?: RequestConfigType) => {
      return fetch(`${API_URL}/v1/employees/${data.id}`, {
        method: "PATCH",
        body: JSON.stringify(data.data),
        ...requestConfig,
      }).then(wrapperFetchJsonResponse<EmployeePatchResponse>);
    },
    [fetch]
  );
}

export type EmployeesDeleteRequest = {
  id: Employee["id"];
};

export type EmployeesDeleteResponse = undefined;

export function useDeleteEmployeesService() {
  const fetch = useFetch();

  return useCallback(
    (data: EmployeesDeleteRequest, requestConfig?: RequestConfigType) => {
      return fetch(`${API_URL}/v1/employees/${data.id}`, {
        method: "DELETE",
        ...requestConfig,
      }).then(wrapperFetchJsonResponse<EmployeesDeleteResponse>);
    },
    [fetch]
  );
}
