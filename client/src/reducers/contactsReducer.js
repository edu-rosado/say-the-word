import { GET_ONLINE_CONTACTS } from "../actions/types";

const initialState = {
    online: []
}
export default function(state=initialState, action=null){
    switch(action.type){
        case GET_ONLINE_CONTACTS:
            return {...state, online: action.payload}
        default:
            return state
    }
}
