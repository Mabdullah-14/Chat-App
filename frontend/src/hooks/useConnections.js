import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  searchUser,
  sendConnectionRequest,
  getIncomingRequests,
  handleConnectionRequests,
} from "../services/connections";

const INCOMING_KEY = ["connections", "incoming"];

export const useSearchUser = (email) => {
  return useQuery({
    queryKey: ["connections", "search", email],
    queryFn: async () => {
      const res = await searchUser(email);
      const foundUser = res.data;
      if (!foundUser?.id) {
        throw new Error("User not found.");
      }
      return foundUser;
    },
    enabled: !!email,
    retry: false,
  });
};

export const useSendConnectionRequest = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (receiverId) => sendConnectionRequest({ receiverId }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["connections"] });
    },
  });
};

export const useIncomingRequests = () => {
  return useQuery({
    queryKey: INCOMING_KEY,
    queryFn: async () => {
      const res = await getIncomingRequests();
      return Array.isArray(res.data) ? res.data : [];
    },
    refetchInterval: 60000,
  });
};

export const useRespondToRequest = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ connectionId, status }) =>
      handleConnectionRequests(connectionId, status),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: INCOMING_KEY });
      queryClient.invalidateQueries({ queryKey: ["contacts"] });
    },
  });
};