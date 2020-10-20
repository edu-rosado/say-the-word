import {GUEST_LOGIN, LOGIN, LOGOUT_USER, REGISTER, REHYDRATE_USER} from './types'
import axios from 'axios'
import {getTokenPayload} from './aux'

export const registerUser = (formData) => async dispatch =>{
    return await axios.post("/api/user/register", formData)
        .then(res => {
            const token = res.headers["authorization"].split(" ")[1]
            dispatch({
                type: REGISTER,
                payload: {
                    token: token,
                    ...getTokenPayload(token)
                }
            })
            return null;
        }).catch(e => {return e.response.data})
}

export const loginUser = (formData) => async dispatch =>{
    return await axios.post("/api/user/login", formData)
        .then(res => {
            const token = res.headers["authorization"].split(" ")[1]
            dispatch({
                type: LOGIN,
                payload: {
                    token: token,
                    ...getTokenPayload(token)
                }
            })
            return null;
        }).catch(e => {return e.response.data})
}

export const loginGuestUser = (formData) => async dispatch =>{
    return await axios.post("/api/user/login-guest", formData)
        .then(res => {
            const token = res.headers["authorization"].split(" ")[1]
            dispatch({
                type: GUEST_LOGIN,
                payload: {
                    token: token,
                    ...getTokenPayload(token)
                }
            })
            return null;
        }).catch(e => {return e.response.data})
}

export const rehydrateUser = (user) => ({
    type: REHYDRATE_USER,
    payload: user,
})
export const logoutUser = () => ({
    type: LOGOUT_USER,
    payload: null,
})
