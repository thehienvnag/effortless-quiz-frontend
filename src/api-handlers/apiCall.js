import axios from "axios";
import { getCookie } from "../store/utils/Utilities";
const baseURL = "https://effortless-quiz-back-end.herokuapp.com/api/";
const fbBaseURL = "https://graph.facebook.com/me";
import { mutationTypes } from "../store/mutations/userMutations";

export const axiosInstance = axios.create({
  baseURL,
  responseType: "application/json",
  headers: {
    "X-Requested-With": "XMLHttpRequest",
  },
});
axiosInstance.defaults.headers.common['Access-Control-Allow-Origin'] = '*';

export const fbAxiosInstance = axios.create({
  baseURL: fbBaseURL,
  headers: {
    "X-Requested-With": "XMLHttpRequest",
  },
});

export const authenticateAction = (callback) => {
  const accessToken = getCookie("accessToken");
  if (accessToken)
    axiosInstance.defaults.headers.authorization = `Bearer ${accessToken}`;
  return async (...args) => {
    try {
      return await callback(...args);
    } catch (err) {
      console.log(err);
      if (err.response && err.response.status === 401) {
        refreshToken(...args);
        return await callback(...args); 
      }
    }
  };
};

const refreshToken = async ({ commit }) => {
  const oldRefreshToken = getCookie("refreshToken");
  const { data } = await axiosInstance.post("auth/refresh", {
    refreshToken: oldRefreshToken,
  });
  commit(mutationTypes.SAVE_USER, data);
  const { accessToken } = data;
  if (accessToken)
    axiosInstance.defaults.headers.authorization = `Bearer ${accessToken}`;
};
