import { ADD_FRIEND, GET_FRIENDS } from "../actions/types";

export default function(state=[], action=null){
    switch(action.type){
        case GET_FRIENDS:
            return action.payload
        case ADD_FRIEND:
            return [...state, action.payload]
        default:
            return state
    }
}
