import { CREATE_GAME, GET_GAMES } from "../actions/types";

export default function(state=[], action=null){
    switch(action.type){
        case CREATE_GAME:
            return [...state, action.payload]
        case GET_GAMES:
            return action.payload
        default:
            return state
    }
}