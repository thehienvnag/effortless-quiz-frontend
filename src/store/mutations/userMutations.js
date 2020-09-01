import { setTokenToCookie, removeTokenFromCookie } from "../utils/Utilities";
export const mutationTypes = {
  SAVE_USER: "SAVE_USER",
  REMOVE_USER: "REMOVE_USER",
  SAVE_USER_LIST: "SAVE_USER_LIST",
  UPDATE_USER_ROLE: "UPDATE_USER_ROLE",
};
export const mutations = {
  [mutationTypes.SAVE_USER]: (state, data) => {
    const { accessToken, refreshToken, user } = data;
    if (user) setTokenToCookie(user.id, accessToken, refreshToken);
    state.currentUser = user || data;
  },
  [mutationTypes.UPDATE_USER_ROLE]: ({ currentUser }, data) => {
    if (currentUser) {
      const { userRoles } = data;
      Object.assign(currentUser, { userRoles: userRoles });
    }
  },
  [mutationTypes.REMOVE_USER]: (state, userId) => {
    removeTokenFromCookie();
    state.currentUser = null;
    console.log(userId);
  },
  [mutationTypes.SAVE_USER_LIST]: (state, userList) => {
    state.userList = userList;
  },
};
