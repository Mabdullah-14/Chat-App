import { API } from "./api";
import { handleApiError } from "./auth";

export const fetchNotifications = async () => {
  try {
    const res = await API.get("/notifications");
    return res.data;
  } catch (error) {
    handleApiError(error);
  }
};

export const clearNotifications = async (senderId) => {
  try {
    const res = await API.post("/notifications/clear", { senderId });
    return res.data;
  } catch (error) {
    handleApiError(error);
  }
};

export const notificationStream = async () => {
  try {
    const res = await API.get("/stream");
    return res.data;
  } catch (error) {
    handleApiError(error);
  }
};