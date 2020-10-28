import { SET_ACTIVE_GAME } from "../actions/types"

const initialState = {
    _id: null,
    title: null,
    participants: null,
    maxParticipants: null,
    messages: [],
}
export default function(state=initialState, action=null){
    switch(action.type){
        case SET_ACTIVE_GAME:
            return action.payload
        default: return state
    }
}
