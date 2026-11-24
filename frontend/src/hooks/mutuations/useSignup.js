import { useMutation, useQueryClient } from "@tanstack/react-query";
import { signup } from "../../services/auth";

export const useSignup = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: signup,
    onSuccess: () => {
     return queryClient.invalidateQueries({ queryKey: ["profile"] });
    },
  });
};