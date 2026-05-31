import API from "@/lib/api";

export const loginUser = async (email: string, password: string) => {
  const res = await API.post("users/login/", { email, password });

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

export const registerUser = async (data: {
  full_name: string;
  email: string;
  password: string;
  business_name?: string;
}) => {
  const res = await API.post("users/register/", data);
  return res.data;
};
