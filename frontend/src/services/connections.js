import { API } from "./api";
import { handleApiError } from "./auth";
export const searchUser = async (email) => {
  try {
    const res = await API.post("/connections/search", { email });
    return res.data;
  } catch (error) {
    handleApiError(error);
  }
};

export const sendConnectionRequest = async (data) => {
  try {
    const res = await API.post("/connections/request", data);
    return res.data;
  } catch (error) {
    handleApiError(error);
  }
};

export const getIncomingRequests = async () => {
  try {
    const res = await API.get("/connections/requests/incoming");
    return res.data;
  } catch (error) {
    handleApiError(error);
  }
};

export const handleConnectionRequests = async (connectionId, status) => {
  try {
    const res = await API.put(
      `/connections/request/${connectionId}/respond`,
      { status }
    );
    return res.data;
  } catch (error) {
    handleApiError(error);
  }
};

export const getMyContacts = async () => {
  try {
    const res = await API.get("/connections/contacts");
    return res.data;
  } catch (error) {
    handleApiError(error);
  }
};