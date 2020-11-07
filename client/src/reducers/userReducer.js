import {ADD_FRIEND, GET_FRIENDS, GET_WORD, GUEST_LOGIN, LOGIN, LOGOUT_USER, REGISTER, REHYDRATE_USER} from '../actions/types'

const initialState = {
    username: null,
    email: null,
    token: null,
    isGuest: true,
    socket: null,
    friends: [],
}

export default function (state = initialState, action=null){
    switch (action.type){
        case REGISTER:
        case LOGIN:{
            const {username, email, token, socket} = action.payload
            return {
                ...state,
                username,
                email,
                token,
                isGuest: false,
                socket,
            }}
        case GUEST_LOGIN:{
            const {username, token, socket} = action.payload
            return {
                ...state,
                username,
                token,
                socket,
            }}
        case GET_FRIENDS:
            return {
                ...state,
                friends: action.payload,
            }
        case ADD_FRIEND:
            return {
                ...state,
                friends: [...state.friends, action.payload],
            }           
        case REHYDRATE_USER:
            return action.payload
        case LOGOUT_USER:
            return initialState;
        default: return state;
    }
}