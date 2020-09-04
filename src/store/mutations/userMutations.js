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
    let userRole = null;
    if (user.userRoles && user.userRoles[0]) {
      userRole = user.userRoles[0].role.name;
    } else {
      userRole = "ROLE_NOT_CONFIRMED";
      user.userRoles = [{ role: { id: 3, name: "ROLE_NOT_CONFIRMED" } }];
    }

    if (user) setTokenToCookie(user.id, accessToken, refreshToken, userRole);
    state.currentUser = user;
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
