import { useState, useEffect } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { useSocket } from "../../Context/socketContext";
import { useAuth } from "../../Context/authContext";
import { useChatHistory } from "./queries/useChatHistory";
import { useUploadFile } from "./mutuations/useUpload";

export function useChat(receiverId) {
  const socket = useSocket();
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

   const [failedPayload, setFailedPayload] = useState(null);
  const [socketError, setSocketError] = useState(false);


  // Fetching parameters sync using the single receiverId key structure
  const { data, isLoading } = useChatHistory(receiverId);
  const chatLog = Array.isArray(data) ? data : data?.messages || [];

  const { mutateAsync: upload, isPending: uploading } = useUploadFile();

  useEffect(() => {
    if (!socket || !receiverId || !user?.id) return;

    const historyKey = ["chatHistory", receiverId];

    const addMessage = (msg) => {
      queryClient.setQueryData(historyKey, (old) => {
        const list = Array.isArray(old) ? old : old?.messages || [];
        return [...list, msg];
      });
    };

    const onReceive = (msg) => {
      // Receiver view state update routing logic
      if (String(msg.senderId) === String(receiverId)) {
         addMessage(msg);
      }
    };
    
    const onSent = (msg) => {
      // Sender view optimistic update rendering layer
      if (String(msg.receiverId) === String(receiverId)) {
         addMessage(msg); 
      }
    };

    socket.on("receive_message", onReceive);
    socket.on("message_sent_success", onSent);
    
    return () => {
      socket.off("receive_message", onReceive);
      socket.off("message_sent_success", onSent);
    };
  }, [socket, receiverId, user?.id, queryClient]);

  const sendMessage = async (file) => {
    if (!socket || !user?.id) return;

    const text = message.trim();
    if (!text && !file) return;
      
    const localId ="msg_" + Date.now()

    let attachment={}
    if(file){
      try{
        setError("")
        attachment =await upload(file)

      }catch(error){
          setError(error.message || "File upload failed")
           console.log("File uplaod failed.");
           return
      }
    }
    
    const socketPayload={
      localId,
      receiverId,
      text:text || "",
      ...attachment
    }

    if(socket && socket.connected){
      socket.emit("send_message",socketPayload)
      setSocketError(false)
      setFailedPayload(null)
    } else{
       console.log("Socket failed! Saving payload for resend.");
    
        setFailedPayload(socketPayload);
        setSocketError(true);
    }
    setMessage('')
    return true

    
  };

  const resendMessage=()=>{
    if(failedPayload){
      if(socket && socket.connected){
         console.log("Socket reconnected! Dispatching memoized data with ID:", failedPayload.mediaId);
         sendMessage(failedPayload)
      } else{
        console.log("Socket server still offline. Retry blocked.");
      }
    }
  }
  

  return { message, setMessage, chatLog, loading: isLoading, sendMessage, uploading, error,socketError,resendMessage };
}
