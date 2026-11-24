import { useMutation } from "@tanstack/react-query";
import { uploadFile } from "../../services/chat";

export const useUploadFile = () => useMutation({ mutationFn: uploadFile });