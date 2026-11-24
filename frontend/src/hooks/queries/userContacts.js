import { useQuery } from "@tanstack/react-query";
import { getMyContacts } from "../../services/connections";

export const useContacts = () => {
  return useQuery({
    queryKey: ["contacts"],
    queryFn: getMyContacts,
    select: (res) => {
      const list = Array.isArray(res) ? res : res?.data ?? [];
      return list.map((item) => ({
        ...item.contact,            // id, name, email
        connectionId: item.connectionId,
        connectedAt: item.connectedAt,
      }));
    },
  });
};