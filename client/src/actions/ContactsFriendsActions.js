import axios from 'axios'
import { getTokenConfig } from './aux'
import { GET_FRIENDS, GET_ONLINE_CONTACTS } from './types'

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
        })
}
