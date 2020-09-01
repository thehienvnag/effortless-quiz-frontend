import { mutationTypes } from "../mutations/userMutations";
import {
  authenticateAction,
  axiosInstance,
  fbAxiosInstance,
} from "../../api-handlers/apiCall";
const {
  SAVE_USER,
  REMOVE_USER,
  SAVE_USER_LIST,
  UPDATE_USER_ROLE,
} = mutationTypes;

export const actionTypes = {
  logUserIn: "logUserIn",
  logUserInWithFacebook: "logUserInWithFB",
  registerForUser: "registerForUser",
  updateUserRoles: "updateUserRoles",
  logUserOut: "logUserOut",
  saveUserLoggedInLocal: "saveUserLoggedInLocal",
  loadUserById: "loadUserById",
};
import { getItemLocalStorage, getCookie } from "../utils/Utilities";
export const actions = {
  [actionTypes.logUserIn]: async ({ commit }, cred) => {
    const uri = "auth/signin";
    const { data } = await axiosInstance.post(uri, cred);
    const { accessToken } = data;
    if (accessToken)
      axiosInstance.defaults.headers.authorization = `Bearer ${accessToken}`;
    commit(SAVE_USER, data);
    console.log(document.cookie);
    return data;
  },
  [actionTypes.logUserInWithFacebook]: async ({ commit }, accessToken) => {
    const facebookURI = `?access_token=${accessToken}`;
    const requestData = await fbAxiosInstance.get(facebookURI);
    const uri = `auth/login-with-facebook`;
    const { data } = await axiosInstance.post(uri, requestData.data);
    commit(SAVE_USER, data);
    return data;
  },
  [actionTypes.registerForUser]: async ({ commit }, userInfo) => {
    const uri = `auth/register`;
    const { data } = await axiosInstance.post(uri, userInfo);
    console.log(commit);
    return data;
  },
  [actionTypes.updateUserRoles]: async ({ commit, state }, role) => {
    const { id } = state.currentUser;
    const uri = `auth/users/${id}`;
    const { data } = await axiosInstance.put(uri, role);
    commit(UPDATE_USER_ROLE, data);
  },
  [actionTypes.logUserOut]: async ({ commit, state }) => {
    await wait(700);
    commit(REMOVE_USER, state.currentUser.id);
  },
  [actionTypes.saveUserLoggedInLocal]: ({ commit }) => {
    const userList = getItemLocalStorage("userLoggedIn");
    commit(SAVE_USER_LIST, userList);
  },
  [actionTypes.loadUserById]: authenticateAction(async ({ commit }) => {
    const userId = getCookie("userId");
    if (userId) {
      const uri = `users/${userId}`;
      const { data } = await axiosInstance.get(uri);
      commit(SAVE_USER, data);
    }
  }),
};

const wait = (ms) => new Promise((r) => setTimeout(r, ms));
