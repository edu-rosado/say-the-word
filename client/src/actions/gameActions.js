import axios from 'axios'
import { GAME_STATUS_ENDED } from '../components/dashboard/chat/activeChat/ActiveChat'
import {getTokenConfig} from './aux'
import {ADD_PARTICIPANT, CAST_VOTES, CREATE_GAME, END_GAME, GAIN_POINT, GET_MY_GAMES, GET_NOT_MY_GAMES, JOIN_FOLLOW_UP, JOIN_GAME, LEAVE_GAME, LOGOUT_GAMES, RESET_MINE_ACTIVE_ID, SET_MINE_ACTIVE_ID, SET_NOT_MINE_ACTIVE_ID, START_GAME, STORE_MESSAGE, STORE_ROLE} from './types'

export const createGame = (token,gameData) => async dispatch =>{
    const config = getTokenConfig(token)
    return await axios.post("/api/games", gameData, config)
        .then(res =>{
            dispatch({
                type: CREATE_GAME,
                payload: res.data
            })
            console.log(res.data)
            return {id: res.data._id}
        }).catch(e=>{
            return {error: e.response.data.errorMsg}
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

export const sendMessage = (token, gameId, msgText, socket, isImpostor) => async dispatch => {
    const config = getTokenConfig(token)
    const body = {text: msgText}
    let url = `/api/games/${gameId}/messages`
    if (isImpostor){
        url = `/api/games/${gameId}/impostor-messages`
    }
    return axios.post(url, body, config)
        .then(res =>{
            dispatch(storeMessage(res.data.msg, gameId))
            socket.emit("message", {gameId, msg:res.data.msg})
            return null
        })
        .catch(err => {return err})
}

export const startGame = (gameId) => {
    return {
        type: START_GAME,
        payload: gameId,
    }
}

export const startGameApi = (token, gameId, socket, username) => async dispatch =>{
    const config = getTokenConfig(token)
    return await axios.put(`/api/games/${gameId}?action=start`,null, config)
        .then(res =>{
            dispatch(startGame(gameId))
            dispatch(storeRole(
                gameId,
                username,
                res.data.role,
                res.data.impostorFriend
            ))
            socket.emit("gameStarted",{gameId})
            return null
        }).catch(e=>{
            console.log(e, e.response.data)
            return e.response.data.errorMessage
        })
}

export const castVotesApi = (token, gameId, socket, votes, username) => async dispatch =>{
    const config = getTokenConfig(token)
    return await axios.put(`/api/games/${gameId}?action=vote`, {votes}, config)
        .then(res =>{
            dispatch(castVotes(gameId, votes, username))
            if (res.data.status === GAME_STATUS_ENDED){
                socket.emit("gameEnd",{gameId})
                dispatch(endGame(
                    gameId, 
                    res.data.votes, 
                    res.data.points, 
                    res.data.roles, 
                ))
            }
            return null
        }).catch(e=>{
            console.log(e)
            return e.response.data.errorMessage
        })
}

export const castVotes = (gameId, votes, username) => {
    return {
        type: CAST_VOTES,
        payload: {gameId, votes, username},
    }
}

export const storeRole = (gameId, username, role, impostorFriend) => {
    return {
        type: STORE_ROLE,
        payload: {gameId, username, role,impostorFriend},
    }
}

export const endGame = (gameId, votes, points, roles, nominates) => {
    return {
        type: END_GAME,
        payload: {gameId, votes, points, roles, nominates},
    }
}

export const gainPoint = (gameId, username) => {
    return {
        type: GAIN_POINT,
        payload: {gameId,username},
    }
}

export const joinFollowUpApi = (gameId, username, token, socket) => async dispatch => {
    const config = getTokenConfig(token)
    return await axios.put(`/api/games/${gameId}?action=follow-up`, null, config)
        .then(res =>{
            dispatch(joinFollowUp(gameId, username))
            if (res.data.role !== null){
                dispatch(startGame(gameId))
                dispatch(storeRole(
                    gameId,
                    username,
                    res.data.role,
                    res.data.impostorFriend
                ))
                socket.emit("gameStarted",{gameId})
            }
            return null
        }).catch(e=>{
            console.log(e)
            return e.response.data.errorMessage
        })
}

export const joinFollowUp = (gameId, username) => {
    return {
        type: JOIN_FOLLOW_UP,
        payload: {gameId, username},
    }
}

export const logoutGames = () =>{
    return {
        type: LOGOUT_GAMES,
    }
}

