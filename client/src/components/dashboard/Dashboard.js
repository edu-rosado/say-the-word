import React from 'react'
import Sidebar from './sidebar/Sidebar'
import Chat from './chat/Chat'

import Axios from 'axios';
import { useHistory } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { useEffect } from 'react';
import { getTokenConfig } from '../../actions/aux';
import { createSocket } from '../../actions/userActions';

export default function Dashboard() {

    const {username, token} = useSelector(state => state.user)
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

    return (
        <div className="m-dashboard-container">
            <div className="m-dashboard">
                <Sidebar/>
                <Chat/>
            </div>
        </div>
    )
}
