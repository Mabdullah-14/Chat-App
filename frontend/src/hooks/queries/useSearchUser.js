import { useQuery } from "@tanstack/react-query";
import { searchUser } from "../../services/connections";
import { useDebounce } from "../useDebounce";

export const useSearchUser = (email) => {
  const debouncedEmail = useDebounce(email, 500);

  return useQuery({
    queryKey: ["connections", "search", debouncedEmail],
    queryFn: async () => {
      const res = await searchUser(debouncedEmail);
      const foundUser = res?.data ?? res;
      if (!foundUser?.id) throw new Error("User not found.");
      return foundUser;
    },
    enabled: !!debouncedEmail && debouncedEmail.length > 2,
    retry: false,
  });
};