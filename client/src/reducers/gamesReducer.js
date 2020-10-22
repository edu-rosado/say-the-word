import { CREATE_GAME } from "../actions/types";

export default function(state=[], action=null){
    switch(action.type){
        case CREATE_GAME:
            return [...state, action.payload]
        default:
            return state
    }
}