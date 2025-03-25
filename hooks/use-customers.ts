import useSWR from "swr";
import { getCustomers } from "@/lib/actions/customer";

export function useCustomers() {
  const { data, error, isLoading, mutate } = useSWR("customers", getCustomers);

  return {
    customers: data,
    isLoading,
    isError: error,
    mutate,
  };
} 