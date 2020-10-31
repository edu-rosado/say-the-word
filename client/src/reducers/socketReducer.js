import { CONNECT_SOCKET, DISCONNECT_SOCKET } from "../actions/types";

export default function (state=null, action){
    switch(action.type){
        case CONNECT_SOCKET:
            return action.payload
        case DISCONNECT_SOCKET:
            return null
        default:
            return state

            
    }
}