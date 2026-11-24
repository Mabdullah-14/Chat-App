import { useMutation, useQueryClient } from "@tanstack/react-query";
import { handleConnectionRequests } from "../../services/connections";

// export const useRespondConnectionRequest = () => {
//   const queryClient = useQueryClient();

//   return useMutation({
//     mutationFn: ({ connectionId, status }) =>
//       handleConnectionRequests(connectionId, status),
//     onSuccess: () => {
//       queryClient.invalidateQueries({ queryKey: ["incomingRequests"] });
//       queryClient.invalidateQueries({ queryKey: ["contacts"] });
//     },
//   });
// };


export const useRespondConnectionRequest = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ connectionId, status }) => 
      handleConnectionRequests(connectionId, status),

    onMutate: async ({ connectionId, status }) => {
      await queryClient.cancelQueries({ queryKey: ["incomingRequests"] });

      const previousRequests = queryClient.getQueryData(["incomingRequests"]);

      queryClient.setQueryData(["incomingRequests"], (oldData) => {
        if (!oldData) return [];
        return oldData.filter((req) => req.id !== connectionId);
      });

      return { previousRequests };
    },

    onError: (err, variables, context) => {
      if (context?.previousRequests) {
        queryClient.setQueryData(["incomingRequests"], context.previousRequests);
      }
    },

    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["incomingRequests"] });
      queryClient.invalidateQueries({ queryKey: ["contacts"] });
    },
  });
};