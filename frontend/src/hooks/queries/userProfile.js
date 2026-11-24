import {useQuery} from '@tanstack/react-query'
import { verifyUser } from '../../services/auth'

export const useUserProfile=()=>{
   return useQuery({
    queryKey:["profile"],
    queryFn:verifyUser
   })
} 