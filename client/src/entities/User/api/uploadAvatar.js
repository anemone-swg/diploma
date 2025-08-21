import axiosInstance from "@/shared/api/axiosInstance.js";

export const uploadAvatar = async (file, id) => {
  const formData = new FormData();
  formData.append("avatar", file);
  await axiosInstance.post(`/account/upload_avatar/${id}`, formData);
};
