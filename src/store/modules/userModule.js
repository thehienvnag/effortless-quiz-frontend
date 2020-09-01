//import User from "../../data-types/User";
import { actions } from "../actions/userAction"
import { mutations } from "../mutations/userMutations";

export const userModule = {
  state: {
    currentUser: null,
    userList: null
  },
  mutations: mutations,
  actions: actions,
};