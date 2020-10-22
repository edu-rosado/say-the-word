import axios from 'axios'
import {getTokenConfig} from './aux'
import {CREATE_GAME} from './types'

export const createGame = (token,gameData) => async dispatch =>{
    const config = getTokenConfig(token)
    return await axios.post("api/games", gameData, config)
        .then(res =>{
            dispatch({
                type: CREATE_GAME,
                payload: res.data
            })
            return null
        }).catch(e=>{
            return e.response.data
        })
}