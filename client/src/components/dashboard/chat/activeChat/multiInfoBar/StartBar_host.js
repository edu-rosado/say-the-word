import React from 'react'
import { Button } from 'react-bootstrap'
import { useDispatch, useSelector } from 'react-redux'
import { startGame, startGameApi } from '../../../../../actions/gameActions'
import IngameBar from './IngameBar'

export default function StartBar_host({
    gameId
}) {

    const {token, username} = useSelector(state => state.user)
    const socket = useSelector(state => state.socket)
    const dispatch = useDispatch()

    const handleStart = async () =>{
        const error = await dispatch(startGameApi(token, gameId, socket, username))
        if (error !== null){
            console.log(error)
        } else{
            // setMultiInfoBar(<IngameBar/>)
        }
    }
    
    return (
        <div className="multi-info-bar with-action">
            <p>You are the host. The power to start the game is yours</p>
            <Button
                variant="success"
                onClick={handleStart}
            >Start game</Button>
        </div>
    )
}
