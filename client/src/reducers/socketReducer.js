import { CONNECT_SOCKET, DISCONNECT_SOCKET } from "../actions/types";

export default function (state={}, action){
    switch(action.type){
        case CONNECT_SOCKET:
            return action.payload
        case DISCONNECT_SOCKET:
        default:
            return {}
    }
}