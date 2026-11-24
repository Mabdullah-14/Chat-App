import { useMutation, useQueryClient } from "@tanstack/react-query";
import { sendConnectionRequest } from "../../services/connections";

// export const useSendConnectionRequest = () => {
//   const queryClient = useQueryClient();

//   return useMutation({
//     mutationFn: (receiverId) => sendConnectionRequest({ receiverId }),
//     onSuccess: () => {
//       queryClient.invalidateQueries({ queryKey: ["connections"] });
//     },
//   });
// };

export const useSendConnectionRequest = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (receiverId) => sendConnectionRequest({ receiverId }),
    onMutate: async (receiverId) => {
      await queryClient.cancelQueries({ queryKey: ["connections"] });
      
      const previousConnections = queryClient.getQueryData(["connections"]);

      queryClient.setQueryData(["connections"], (oldData) => {
        const fallbackData = Array.isArray(oldData) ? oldData : [];
        return [
          ...fallbackData,
          {
            id: `temp-${Date.now()}`,
            receiverId: receiverId,
            status: "pending",
            createdAt: new Date().toISOString(),
          },
        ];
      });

      return { previousConnections };
    },
    onError: (err, receiverId, context) => {
      if (context?.previousConnections) {
        queryClient.setQueryData(["connections"], context.previousConnections);
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["connections"] });
    },
  });
};
