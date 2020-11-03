import React from 'react'
import Sidebar from './sidebar/Sidebar'
import Chat from './chat/Chat'

import Axios from 'axios';
import { useHistory } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { useEffect } from 'react';
import { getTokenConfig } from '../../actions/aux';
import { createSocket } from '../../actions/userActions';
import { addParticipant, gainPoint, storeMessage } from '../../actions/gameActions';
import Media from 'react-media';

export default function Dashboard() {

    const {username, token} = useSelector(state => state.user)
    const myGames = useSelector(state => state.games.myGames)
    const socket = useSelector(state => state.socket)
    const history = useHistory();
    const dispatch = useDispatch();

    useEffect(()=>{
        // Push to login if token is invalid, else connect socket
        const config = getTokenConfig(token)
        Axios.get("api/auth/verify-token",config)
            .then(() => {
                dispatch(createSocket(username))
            })
            .catch(err => {
                history.push("/")
            })
    },[])

    useEffect(() => {
        if (socket !== null){
            socket.on("newParticipant",({username, gameId}) =>{
                dispatch(addParticipant(username, gameId))
                const msg = {
                    text: `'${username}' has joined the game`,
                    author: "",
                    date: new Date().toString(),
                }
                console.log(msg)
                console.log("joined: ",username, gameId)
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
