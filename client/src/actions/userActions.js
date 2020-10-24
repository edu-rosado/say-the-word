import {CONNECT_SOCKET, GUEST_LOGIN, LOGIN, LOGOUT_USER, REGISTER, REHYDRATE_USER,DISCONNECT_SOCKET} from './types'
import axios from 'axios'
import {connectToSocket, getTokenPayload} from './aux'

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
            const socket = connectToSocket(5001, formData.username,false)
            dispatch(storeSocket(socket))
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
            const socket = connectToSocket(5001, tokenPayload.username,false)
            dispatch(storeSocket(socket))
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
            const socket = connectToSocket(5001, formData.username,true)
            dispatch(storeSocket(socket))
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

export const storeSocket = (socket) =>{
    return {
        type: CONNECT_SOCKET,
        payload: socket
    }
}
export const disconnectFromSocket = (socket) =>{
    try{
        socket.close()
    } catch (error){
        console.log("discon error ", error)
    }
    return {
        type: DISCONNECT_SOCKET,
        payload: socket
    }
}