import { GET_FRIENDS } from "../actions/types";

export default function(state=[], action=null){
    switch(action.type){
        case GET_FRIENDS:
            return action.payload
        default:
            return state
    }
}
