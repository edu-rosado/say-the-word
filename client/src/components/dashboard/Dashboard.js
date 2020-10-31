import React from 'react'
import Sidebar from './sidebar/Sidebar'
import Chat from './chat/Chat'

import Axios from 'axios';
import { useHistory } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { useEffect } from 'react';
import { getTokenConfig } from '../../actions/aux';
import { createSocket } from '../../actions/userActions';
import { storeMessage } from '../../actions/gameActions';

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
            socket.on("message",({msg,gameId}) =>{
                dispatch(storeMessage())
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
                <Chat/>
            </div>
        </div>
    )
}
