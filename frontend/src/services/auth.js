import { API } from "./api";

export const handleApiError = (error) => {
  const message =
    error?.response?.data?.message || error.message || "Something went wrong";
  throw new Error(message);
};

export const signup = async (data) => {
  try {
    const res = await API.post("/auth/signup", data);
    return res.data;
  } catch (error) {
    handleApiError(error);
  }
};

export const login = async (data) => {
  try {
    const res = await API.post("/auth/login", data);
    return res.data;
  } catch (error) {
    handleApiError(error);
  }
};

export const verifyUser = async () => {
  try {
    const res = await API.get("/auth/verify-user");
    return res.data;
  } catch (error) {
    handleApiError(error);
  }
};

export const fetchAllUsers = async () => {
  try {
    const res = await API.get("/auth/users");
    return res.data;
  } catch (error) {
    handleApiError(error);
  }
};

export const logout = async () => {
  try {
    const res = await API.post("/auth/logout");
    return res.data;
  } catch (error) {
    handleApiError(error);
  }
};