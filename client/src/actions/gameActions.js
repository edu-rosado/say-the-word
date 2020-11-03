import axios from 'axios'
import {getTokenConfig} from './aux'
import {ADD_PARTICIPANT, CREATE_GAME, GAIN_POINT, GET_MY_GAMES, GET_NOT_MY_GAMES, GET_WORD, JOIN_GAME, LEAVE_GAME, LOGOUT_GAMES, RESET_ACTIVE_ID, RESET_MINE_ACTIVE_ID, SET_ACTIVE_ID, SET_MINE_ACTIVE_ID, SET_NOT_MINE_ACTIVE_ID, STORE_MESSAGE} from './types'

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
                payload: {game: res.data, username}
            })
            return null
        }).catch(e=>{
            console.log(e)
            return e.response.data.errorMessage
        })
}

export const addParticipant = (username, gameId) => {
    return {
        type: ADD_PARTICIPANT,
        payload: {username, gameId},
    }
}

export const setMineActiveId = (gameId) =>{
    return {
        type: SET_MINE_ACTIVE_ID,
        payload: gameId
    }
}
export const setNotMineActiveId = (gameId) =>{
    return {
        type: SET_NOT_MINE_ACTIVE_ID,
        payload: gameId
    }
}
export const resetMineActiveId = () =>{
    return {
        type: RESET_MINE_ACTIVE_ID,
    }
}

export const storeMessage = (msg, gameId) =>{
    return {
        type: STORE_MESSAGE,
        payload: {msg, gameId}
    }
}

export const sendMessage = (token, gameId, msgText, socket) => async dispatch => {
    const config = getTokenConfig(token)
    const body = {text: msgText}
    return axios.post(`/api/games/${gameId}/messages`, body, config)
        .then(res =>{
            dispatch(storeMessage(res.data.msg, gameId))
            socket.emit("message", {gameId, msg:res.data.msg})
            if (res.data.gotPoint){
                socket.emit("concedePoint", {
                    gameId,
                    msg: {
                        author: "",
                        date: "", // To do, format the real date nicely
                        text: `${res.data.loserName} said the word '${res.data.word}' and gave a point to ${res.data.winnerName}`,
                    },
                    winner: res.data.winnerName,
                })
            }
            return null
        })
        .catch(err => {return err})
}

export const gainPoint = (gameId, username) => {
    return {
        type: GAIN_POINT,
        payload: {gameId,username},
    }
}

export const logoutGames = () =>{
    return {
        type: LOGOUT_GAMES,
    }
}

