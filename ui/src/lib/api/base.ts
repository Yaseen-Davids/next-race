import {
  useMutation,
  UseMutationResult,
  useQuery,
  UseQueryResult,
} from "@tanstack/react-query";
import axios, { AxiosResponse } from "axios";

const STALE_TIME = 1000 * 60 * 30; // 30 minutes

export const useAll = <T>(
  endpoint: string,
  queryKey?: string
): UseQueryResult<T[]> => {
  return useQuery<T[]>({
    queryKey: [queryKey ?? endpoint, "all"],
    queryFn: () =>
      axios
        .get(`/api/${endpoint}`, {
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
            Authorization: `Bearer ${localStorage.getItem("sessionToken")}`,
          },
        })
        .then((res) => res.data),
    retry: false,
    staleTime: STALE_TIME,
  });
};

export const useFindAll = <T>(
  endpoint: string,
  id: string,
  key: string,
  queryKey?: string
): UseQueryResult<T[]> => {
  return useQuery<T[]>({
    queryKey: [queryKey ?? endpoint, "all"],
    queryFn: () =>
      axios
        .get(`/api/${endpoint}/all/${id}?key=${key}`, {
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
            Authorization: `Bearer ${localStorage.getItem("sessionToken")}`,
          },
        })
        .then((res) => res.data),
    retry: false,
    staleTime: STALE_TIME,
  });
};

export const useFindBy = <T>(
  endpoint: string,
  id: string,
  key: string,
  queryKey?: string
): UseQueryResult<T> => {
  return useQuery<T>({
    queryKey: [queryKey ?? endpoint, "single", id],
    queryFn: () =>
      axios
        .get(`/api/${endpoint}/single/${id}?key=${key}`, {
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
            Authorization: `Bearer ${localStorage.getItem("sessionToken")}`,
          },
        })
        .then((res) => res.data),
    retry: false,
    staleTime: STALE_TIME,
  });
};

export const useSingle = <T>(
  endpoint: string,
  id: string | undefined,
  queryKey?: string
): UseQueryResult<T> => {
  return useQuery<T>({
    queryKey: [queryKey ?? endpoint, "single", id],
    queryFn: () =>
      axios
        .get(`/api/${endpoint}/single/${id}`, {
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
            Authorization: `Bearer ${localStorage.getItem("sessionToken")}`,
          },
        })
        .then((res) => res.data),
    enabled: !!id && id !== "",
    retry: false,
    staleTime: STALE_TIME,
  });
};

export const useUpdate = <T>(
  endpoint: string
): UseMutationResult<
  Response,
  Error,
  { id: string | number; data: Partial<T> },
  unknown
> => {
  return useMutation({
    mutationKey: [`update-${endpoint}`],
    mutationFn: ({ id, data }: { id: string | number; data: Partial<T> }) =>
      axios.put(`/api/${endpoint}/${id}`, data, {
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          Authorization: `Bearer ${localStorage.getItem("sessionToken")}`,
        },
      }),
  });
};

export const useCreate = <T>(
  endpoint: string
): UseMutationResult<
  AxiosResponse,
  Error,
  { [key: string]: Partial<T> },
  unknown
> => {
  return useMutation({
    mutationKey: [`create-${endpoint}`],
    mutationFn: (data: { [key: string]: Partial<T> }) =>
      axios.post(`/api/${endpoint}`, data, {
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          Authorization: `Bearer ${localStorage.getItem("sessionToken")}`,
        },
      }),
  });
};

export const useRemove = (
  endpoint: string
): UseMutationResult<AxiosResponse, Error, { id: string }, unknown> => {
  return useMutation({
    mutationKey: [`remove-${endpoint}`],
    mutationFn: ({ id }: { id: string }) =>
      axios.delete(`/api/${endpoint}/${id}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("sessionToken")}`,
        },
      }),
  });
};

export const useUpsert = <T>(
  endpoint: string
): UseMutationResult<
  AxiosResponse,
  Error,
  { id: string | undefined; data: Partial<T> },
  unknown
> => {
  return useMutation({
    mutationKey: [`upsert-${endpoint}`],
    mutationFn: ({ id, data }: { id: string | undefined; data: Partial<T> }) =>
      axios.post(
        `/api/${endpoint}/upsert`,
        { id, ...data },
        {
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
            Authorization: `Bearer ${localStorage.getItem("sessionToken")}`,
          },
        }
      ),
  });
};

interface CreateHooksParams {
  endpoint: string;
  queryKey?: string;
  interval?: number;
}

export const createReadonlyHooks = <T>(params: CreateHooksParams) => ({
  useAll: () => useAll<T>(params.endpoint, params.queryKey),
  useSingle: (id: string | undefined) =>
    useSingle<T>(params.endpoint, id, params.queryKey),
  useFindAll: (value: any, key: string = "id") =>
    useFindAll<T>(params.endpoint, value, key, params.queryKey),
  useFindBy: (id: string, key: string = "id") =>
    useFindBy<T>(params.endpoint, id, key, params.queryKey),
});

export const createWriteableHooks = <T>(params: CreateHooksParams) => ({
  ...createReadonlyHooks<T>(params),
  useUpdate: () => useUpdate<T>(params.endpoint),
  useCreate: () => useCreate<T>(params.endpoint),
  useRemove: () => useRemove(params.endpoint),
  useUpsert: () => useUpsert<T>(params.endpoint),
});

export const useApiGet = <T>(params: CreateHooksParams): UseQueryResult<T> => {
  return useQuery({
    queryKey: params.queryKey
      ? [params.queryKey, params.endpoint]
      : [params.endpoint],
    queryFn: () =>
      axios
        .get(`/api/${params.endpoint}`, {
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
            Authorization: `Bearer ${localStorage.getItem("sessionToken")}`,
          },
        })
        .then((res) => res.data),
    retry: false,
    staleTime: STALE_TIME,
  });
};

export const useApiPost = <T>(
  params: CreateHooksParams
): UseMutationResult<AxiosResponse, Error, Partial<T>, unknown> => {
  return useMutation({
    mutationKey: params.queryKey
      ? [params.queryKey, params.endpoint]
      : [params.endpoint],
    mutationFn: (body: Partial<T>) =>
      axios.post(`/api/${params.endpoint}`, body, {
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          Authorization: `Bearer ${localStorage.getItem("sessionToken")}`,
        },
      }),
    retry: false,
  });
};
