import { API } from "./api";
import { handleApiError } from "./auth";

export const chatHistory = async ({ receiverId }) => {
  try {
    const res = await API.get(`/chat/history/${receiverId}`);
    return res.data;
  } catch (error) {
    handleApiError(error);
  }
};


export const uploadFile = async (file) => {
  try {
    const formData = new FormData();
    formData.append("file", file);
    const res = await API.post("/chat/upload", formData);
    return res.data;
  } catch (error) {
    handleApiError(error);
  }
};