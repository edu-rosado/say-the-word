import React from 'react'
import { useEffect } from 'react'
import { useState } from 'react'
import { Button } from 'react-bootstrap'
import { useDispatch, useSelector } from 'react-redux'
import { useHistory } from 'react-router-dom'
import { joinLeaveGame, resetMineActiveId } from '../../../actions/gameActions'
import { MY_GAMES_KEY } from './GamesPane'

export default function GamePreview({
    game, isGameOfMine, setActiveKey
}) {
    const {
        _id, 
        title, 
        participants, 
        hasPassword, 
        maxParticipants
    } = game
    let participantString = participants.reduce(
        (myString, participant) => myString + `${participant}, `, ""
    ).slice(0, -2)

    const [actionsContainerClass, setactionsContainerClass] = useState("game-actions-container")

    const {token, username} = useSelector(state => state.user)
    const {activeMineId,activeNotMineId} = useSelector(state => state.games)
    const dispatch = useDispatch()
    const history = useHistory()

    const handleJoin = async () =>{
        const error = await dispatch(joinLeaveGame(token, _id, username, "join"))
        if (error){
            console.log(error)
        }else if (window.matchMedia("(max-width: 768px)").matches){
            history.push("/mobile/chat")
        }
        setActiveKey(MY_GAMES_KEY)
    }
    const handleLeave = async () =>{
        const error = await dispatch(joinLeaveGame(token, _id, username, "leave"))
        if (error){
            console.log(error)
        }
        dispatch(resetMineActiveId())
    }

    useEffect(()=>{
        if (activeMineId === _id){
            setactionsContainerClass("game-actions-container active")
        } else{
            setactionsContainerClass("game-actions-container")
        }
    },[activeMineId])
    useEffect(()=>{
        if (activeNotMineId === _id){
            setactionsContainerClass("game-actions-container active")
        } else{
            setactionsContainerClass("game-actions-container")
        }
    },[activeNotMineId])
    
    return (
        <div 
            className="game-preview-container"
        >
            <div
                className="sidebar-item-preview"
                data-id={_id}
                data-isMine={isGameOfMine}
            >
                <h3>{title}</h3>
                <p className="text-muted">{participantString}</p>
                { hasPassword ? (
                    <p className="text-muted">* it is password protected</p>
                ) : ""}
                <p>Participants: {participants.length}/{maxParticipants}</p>
                <div className={actionsContainerClass}>
                    <div className={isGameOfMine? "disabled" : "active"}>
                        <Button
                            variant="success"
                            onClick={handleJoin}
                        >Join</Button>
                    </div>
                    <div className={isGameOfMine? "active" : "disabled"}>
                        <Button
                            variant="danger"
                            onClick={handleLeave}
                        >Leave</Button>
                    </div>
                </div>
            </div>

        </div>
    )
}
