import API from "./api";

export const loginUser = async (email, password) => {
  const res = await API.post("token/", {
    email,
    password,
  });

  return res.data;
};

export const refreshToken = async (refresh) => {
  const res = await API.post("token/refresh/", {
    refresh,
  });

  return res.data;
};

export const getMe = async () => {
  const res = await API.get("users/me/");
  return res.data;
};