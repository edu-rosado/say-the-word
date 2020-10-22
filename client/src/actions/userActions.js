import {CONNECT_SOCKET, GUEST_LOGIN, LOGIN, LOGOUT_USER, REGISTER, REHYDRATE_USER,DISCONNECT_SOCKET} from './types'
import axios from 'axios'
import {getTokenPayload} from './aux'
import io from 'socket.io-client'

export const registerUser = (formData) => async dispatch =>{
    return await axios.post("/api/auth/register", formData)
        .then(res => {
            const token = res.headers["authorization"].split(" ")[1]
            dispatch({
                type: REGISTER,
                payload: {
                    token: token,
                    ...getTokenPayload(token),
                }
            })
            dispatch(connectToSocket(5001, formData.username,false))
            return null;
        }).catch(e => {return e.response.data})
}

export const loginUser = (formData) => async dispatch =>{   
    return await axios.post("/api/auth/login", formData)
        .then(res => {
            const token = res.headers["authorization"].split(" ")[1]
            const tokenPayload = getTokenPayload(token)
            dispatch({
                type: LOGIN,
                payload: {
                    token: token,
                    ...tokenPayload,
                }
            })
            dispatch(connectToSocket(5001, tokenPayload.username,false))
            return null;
        }).catch(e => {return e.response.data})
}

export const loginGuestUser = (formData) => async dispatch =>{
    return await axios.post("/api/auth/login-guest", formData)
        .then(res => {
            const token = res.headers["authorization"].split(" ")[1]
            dispatch({
                type: GUEST_LOGIN,
                payload: {
                    token: token,
                    ...getTokenPayload(token),
                }
            })
            dispatch(connectToSocket(5001, formData.username,true))
            return null;
        }).catch(e => {
            return e.response.data
        })
}

export const rehydrateUser = (user) => ({
    type: REHYDRATE_USER,
    payload: user,
})
export const logoutUser = () => {
    
    return {
        type: LOGOUT_USER,
        payload: null,
    }
}

export const connectToSocket = (port, username, isGuest) =>{
    const socket = io(`http://localhost:${port}`,{query: {username,isGuest,},}) 
    return {
        type: CONNECT_SOCKET,
        payload: socket
    }
}
export const disconnectFromSocket = (socket) =>{
    socket.close()
    return {
        type: DISCONNECT_SOCKET,
        payload: socket
    }
}