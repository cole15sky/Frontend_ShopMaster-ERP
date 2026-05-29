import API from "@/lib/api";

export const loginUser = async (email: string, password: string) => {
  const res = await API.post("token/", { email, password });

  if (!res.data?.access) {
    throw new Error("Login failed: no token received");
  }

  return res.data;
};

export const refreshToken = async (refresh: string) => {
  const res = await API.post("token/refresh/", { refresh });
  return res.data;
};

export const getMe = async () => {
  const res = await API.get("users/me/");
  return res.data;
};
