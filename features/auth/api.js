import API from "@/lib/api";

export const loginUser = async (email, password, role) => {
  const res = await API.post("users/login/", { email, password, role });
  return res.data;
};

export const refreshToken = async (refresh) => {
  const res = await API.post("token/refresh/", { refresh });
  return res.data;
};

export const getMe = async () => {
  const res = await API.get("users/me/");
  return res.data;
};
