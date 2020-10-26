import axios from 'axios'
import {getTokenConfig} from './aux'
import {CREATE_GAME, GET_MY_GAMES, GET_NOT_MY_GAMES, JOIN_GAME, LEAVE_GAME} from './types'

export const createGame = (token,gameData) => async dispatch =>{
    const config = getTokenConfig(token)
    return await axios.post("/api/games", gameData, config)
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

export const getGames = (token, username) => async dispatch =>{
    const config = getTokenConfig(token)
    return await axios.get("/api/games", config)
        .then(res =>{
            dispatch({
                type: GET_MY_GAMES,
                payload: res.data.filter( game =>(
                    game.participants.includes(username)
                ))
            })
            dispatch({
                type: GET_NOT_MY_GAMES,
                payload: res.data.filter( game =>(
                    !game.participants.includes(username)
                ))
            })
            return null
        }).catch(e=>{
            return e.response
        })
}

export const joinLeaveGame = (token,gameId, username, action) => async dispatch =>{
    const config = getTokenConfig(token)
    return await axios.put(`/api/games/${gameId}?action=${action}`,null, config)
        .then(res =>{
            dispatch({
                type: (action === "join"? JOIN_GAME : LEAVE_GAME),
                payload: {_id: gameId, username}
            })
            return null
        }).catch(e=>{
            return e.response.data.errorMsg
        })
}


