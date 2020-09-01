import {actions} from "../actions/questionAction"
import { mutations } from "../mutations/questionMutation";
export const questionModule = {
    state: {
        questionList: [],
        currentHighestPos: 0
    },
    actions: actions,
    mutations: mutations
}