import axios from 'axios'
import {getTokenConfig} from './aux'
import {CREATE_GAME, GET_GAMES} from './types'

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
            return e.response.data.errorMsg
        })
}

export const getGames = (token) => async dispatch =>{
    const config = getTokenConfig(token)
    return await axios.get("api/games", config)
        .then(res =>{
            dispatch({
                type: GET_GAMES,
                payload: res.data
            })
            return null
        }).catch(e=>{
            return e.response
        })
}


