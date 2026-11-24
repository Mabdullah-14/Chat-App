import { useMutation,useQueryClient } from "@tanstack/react-query";
import {clearNotifications} from '../../services/notification'

// export const useClearNotification=()=>{
//     const queryClient=useQueryClient()
//     return useMutation({
//         mutationFn:clearNotifications,
//         onSuccess: () => {
//       queryClient.invalidateQueries({ queryKey: ["notifications"] });
//     },
//     })
// }

export const useClearNotification=()=>{
  const queryClient=useQueryClient()
  return useMutation({
    mutationFn:clearNotifications,
    onMutate:async()=>{
      await queryClient.cancelQueries({
        queryKey:["notifications"]
      })
      const previousNotifications=queryClient.getQueryData(["notifications"])
      queryClient.setQueryData(["notifications"],[])
      return {previousNotifications}
    },
    onError:(error,variables,context)=>{
      if(context?.previousNotifications !==undefined){
        queryClient.setQueryData(
          ["notifications"],
          context.previousNotifications
        )
      }
    },
    onSettled:()=>{
      queryClient.invalidateQueries({queryKey:["notifications"]})
    }

  })
}