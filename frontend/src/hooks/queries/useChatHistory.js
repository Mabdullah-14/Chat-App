import { useQuery } from "@tanstack/react-query";
import { chatHistory } from "../../services/chat";

export const useChatHistory = (receiverId) => {
    return useQuery({
        queryKey: ["chatHistory", receiverId],
        
        queryFn: () => chatHistory({ receiverId }),
        
        enabled: !!receiverId,
        
        staleTime: 1000 * 60 * 5, 
    });  
};
