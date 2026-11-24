import { useEffect } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { useSocket } from "../../Context/socketContext";

export const useConnectionSocket = () => {
  const socket = useSocket();
  const queryClient = useQueryClient();

  useEffect(() => {
    if (!socket) return;

    const handleNewRequest = () => {
      queryClient.invalidateQueries({ queryKey: ["connections", "incoming"] });
    };

    const handleAccepted = () => {
      queryClient.invalidateQueries({ queryKey: ["contacts"] });
    };

    socket.on("new_connection_request", handleNewRequest);
    socket.on("connection_accepted", handleAccepted);

    return () => {
      socket.off("new_connection_request", handleNewRequest);
      socket.off("connection_accepted", handleAccepted);
    };
  }, [socket, queryClient]);
};