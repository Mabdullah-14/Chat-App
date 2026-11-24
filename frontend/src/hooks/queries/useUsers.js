import { useQuery } from "@tanstack/react-query";
import { fetchAllUsers } from "../../services/auth";

export const useUsers=()=>{
    useQuery({
        queryKey:['users'],
        queryFn:fetchAllUsers
    })
}