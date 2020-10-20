import {GUEST_LOGIN, LOGIN, LOGOUT_USER, REGISTER, REHYDRATE_USER} from '../actions/types'

const initialState = {
    username: null,
    email: null,
    token: null,
    isGuest: true,
}

export default (state = initialState, action) =>{
    switch (action.type){
        case REGISTER:
        case LOGIN:{
            const {username, email, token} = action.payload
            return {
                username,
                email,
                token,
                isGuest: false,
            }}
        case GUEST_LOGIN:{
            const {username, token} = action.payload
            return {
                username,
                token,
                email: null,
                isGuest: true,
            }}
        case REHYDRATE_USER:
            return action.payload
        case LOGOUT_USER:
            return initialState;
        default: return state;
    }
}