import { useQuery } from "@tanstack/react-query";
import { fetchNotifications } from "../../services/notification";

export const useNotifications=()=>{
    useQuery({
        queryKey:['notifications'],
        queryFn:fetchNotifications
    })
}