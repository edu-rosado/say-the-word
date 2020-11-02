import {CONNECT_SOCKET, GUEST_LOGIN, LOGIN, LOGOUT_USER, REGISTER, REHYDRATE_USER,DISCONNECT_SOCKET} from './types'
import axios from 'axios'
import io from 'socket.io-client'
import {getTokenPayload} from './aux'

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
            return null;
        }).catch(e => {
            return e.response.data
        })
}

export const loginGuestUser = (formData) => async dispatch =>{
    return await axios.post("/api/auth/login-guest", formData)
        .then(res => {
            const token = res.headers["authorization"].split(" ")[1]
            dispatch({
                type: GUEST_LOGIN,
                payload: {
                    ...getTokenPayload(token),
                    token
                }
            })
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

export const createSocket = (username) =>{
    const socketURL = (process.env.NODE_ENV === 'production'
        ? window.location.hostname
        : 'https://localhost:5001')
    const socket = io.connect(socketURL, {query: {username,}, secure: true})
    return {
        type: CONNECT_SOCKET,
        payload: socket
    }
}
export const disconnectFromSocket = (socket) =>{
    try{
        socket.close()
    } catch (error){
        console.log(error)
    }
    return {
        type: DISCONNECT_SOCKET,
        payload: socket
    }
}