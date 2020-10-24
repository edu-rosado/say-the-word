import React from 'react'
import Sidebar from './sidebar/Sidebar'
import Chat from './Chat'
import { useEffect } from 'react'
import { disconnectFromSocket, logoutUser } from '../../actions/userActions'
import { useHistory } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { getGames } from '../../actions/gameActions'
import { LOCAL_STORAGE_KEY } from '../App'

export default function Dashboard() {

    const history = useHistory()
    const dispatch = useDispatch()
    const token = useSelector(state => state.user.token)
    const socket = useSelector(state => state.socket)

    useEffect(()=> {
    async function checkToken(){
        const error = await dispatch(getGames(token))
        if (error){
            // Forbidden, logout
            localStorage.removeItem(LOCAL_STORAGE_KEY)
            await disconnectFromSocket(socket)
            // await dispatch(logoutUser())
        }else{
            console.log("allgood")
        }
        //   
        //   
        //   history.push("/")
        //}
    }
    checkToken()
    }, [])

    return (
        <div className="m-dashboard-container">
            <div className="m-dashboard">
                {/* <Sidebar/>
                <Chat/> */}
            </div>
        </div>
    )
}
