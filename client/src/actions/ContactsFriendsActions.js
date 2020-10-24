import axios from 'axios'
import { getTokenConfig } from './aux'
import { ADD_FRIEND, GET_FRIENDS, GET_ONLINE_CONTACTS } from './types'

export const getOnlineContacts = (token) => async dispatch =>{
    const config = getTokenConfig(token)
    await axios.get("/api/contacts/online", config)
        .then(res => {
            dispatch({
                type: GET_ONLINE_CONTACTS,
                payload: res.data
            })
        })
}

export const getFriends = (token) => async dispatch =>{
    const config = getTokenConfig(token)
    await axios.get("/api/friends", config)
        .then(res => {
            dispatch({
                type: GET_FRIENDS,
                payload: res.data
            })
        }).catch((error)=>{
            return error
        })
}

export const addFriend = (token, selectedValue, field) => async dispatch =>{
    const config = getTokenConfig(token)
    const body = {selectedValue, field}
    return await axios.post("/api/friends", body, config)
        .then(res => {
            dispatch({
                type: ADD_FRIEND,
                payload: res.data.username
            })
            return null
        }).catch((error)=>{
            return error
        })
}
