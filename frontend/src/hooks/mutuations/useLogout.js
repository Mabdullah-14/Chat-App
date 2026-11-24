import { useMutation, useQueryClient } from "@tanstack/react-query";
import { logout } from "../../services/auth";

export const useLogout = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: logout,
    onSettled: () => {
      queryClient.removeQueries({
        predicate: (q) => q.queryKey[0] !== "profile",
      });
      queryClient.setQueryData(["profile"], null);
    },
  });
};