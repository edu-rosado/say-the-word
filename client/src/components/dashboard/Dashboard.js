import React from 'react'
import Sidebar from './sidebar/Sidebar'
import Chat from './chat/Chat'

import Axios from 'axios';
import { useHistory } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { useEffect } from 'react';
import { getTokenConfig } from '../../actions/aux';
import { createSocket } from '../../actions/userActions';
import { addParticipant, endGame, gainPoint, startGame, storeMessage, storeRole } from '../../actions/gameActions';
import Media from 'react-media';
import { useState } from 'react';
import { set } from 'lodash';

export default function Dashboard() {

    // socket would get initialized several times if we 
    // don't explicitly control it with a boolean
    // (for example when popping from history)
    const [socketInitialized, setSocketInitialized] = useState(true)

    const {username, token} = useSelector(state => state.user)
    const myGames = useSelector(state => state.games.myGames)
    const socket = useSelector(state => state.socket)
    const history = useHistory();
    const dispatch = useDispatch();

    useEffect(()=>{
        const config = getTokenConfig(token)
        Axios.get("api/auth/verify-token",config)
            .then(() => {
                if (socket === null){
                    setSocketInitialized(false)
                    dispatch(createSocket(username))
                }
            })
            .catch(err => {
                history.push("/")
            })
    },[])

    useEffect(() => {
        if (socket !== null && !socketInitialized){
            setSocketInitialized(true)
            socket.on("newParticipant",({username, gameId}) =>{
                dispatch(addParticipant(username, gameId))
                const msg = {
                    text: `'${username}' has joined the game`,
                    author: "",
                    date: new Date().toString(),
                }
                dispatch(storeMessage(msg, gameId))
            })
            socket.on("message",({gameId,msg}) =>{
                dispatch(storeMessage(msg, gameId))
            })
            socket.on("pointInfo",({gameId,msg, winner}) =>{
                dispatch(storeMessage(msg, gameId))
                if (winner === username){
                    dispatch(gainPoint(gameId, username))
                }
            })
            socket.on("gameStarted",({gameId}) => {
                dispatch(startGame(gameId))
                socket.emit("getRole", {gameId})
            })
            socket.on("getRole",({gameId, role, impostorFriend}) => {
                dispatch(storeRole(gameId, username, role, impostorFriend))
            })
            socket.on("gameEnd", ({
                gameId, votes, points, roles, nominates
            }) => {
                dispatch(endGame(gameId, votes, points, roles, nominates))
            })
        }
    }, [socket])
    useEffect(() => {
        if (socket !== null){
            myGames.forEach(game => {
                console.log("joining "+game._id)
                socket.emit("join", game._id)
            })
        }
    }, [myGames, socket])

    return (
        <div className="m-dashboard-container">
            <div className="m-dashboard">
                <Sidebar/>
                <Media query="(max-width: 768px)">
                    {matches => matches ? "" : <Chat/>}
                </Media>
                {/* <Chat/> */}
            </div>
        </div>
    )
}
