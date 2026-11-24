import { useContext, createContext } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { useUserProfile } from "../src/hooks/queries/userProfile";
import { useLogout } from "../src/hooks/mutuations/useLogout";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const queryClient = useQueryClient();
  const { data, isLoading } = useUserProfile();
  const { mutateAsync: logoutMutation } = useLogout();

  const user = data?.success ? data.user : null;

  const checkLoginStatus = (authResponse) => {
    const u = authResponse?.user ?? authResponse;
    if (u) 
      queryClient.setQueryData(["profile"], { success: true, user: u });
  };

  const setUser = (u) =>
    queryClient.setQueryData(["profile"], u ? { success: true, user: u } : null);

  const handleLogout = async () => {
    try {
      await logoutMutation();
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        setUser,
        loading: isLoading,
        checkLoginStatus,
        logout: handleLogout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);