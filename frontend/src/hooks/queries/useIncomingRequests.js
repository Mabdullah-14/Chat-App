import { useQuery } from "@tanstack/react-query";
import { getIncomingRequests } from "../../services/connections";

export const useIncomingRequests = () => {
  return useQuery({
    queryKey: ["connections", "incoming"],
    queryFn: getIncomingRequests,
    select: (res) => {
      const list = Array.isArray(res) ? res : res?.data;
      return Array.isArray(list) ? list : [];
    },
  });
};