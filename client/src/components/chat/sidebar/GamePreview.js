import React from 'react'
import { useEffect } from 'react'
import { useState } from 'react'
import { Button } from 'react-bootstrap'
import { useDispatch, useSelector } from 'react-redux'
import { joinLeaveGame } from '../../../actions/gameActions'
import {setActiveGame} from '../../../actions/activeGameActions'

export default function GamePreview({game, isGameOfMine}) {
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

    const [isJoinBtnActive, setisJoinBtnActive] = useState(false)
    const [actionsContainerClass, setactionsContainerClass] = useState("game-actions-container")

    const {token, username} = useSelector(state => state.user)
    const dispatch = useDispatch()

    const handleJoin = async () =>{
        const error = await dispatch(joinLeaveGame(token, _id, username, "join"))
        if (error){
            console.log(error)
        } else{
            dispatch(setActiveGame(game))
        }
    }
    const handleLeave = async () =>{
        const error = await dispatch(joinLeaveGame(token, _id, username, "leave"))
        if (error){
            console.log(error)
        } else{
            dispatch(setActiveGame({}))
        }
    }

    const displayGame = () => {
        if (isGameOfMine){
            dispatch(setActiveGame(game))
        }
        
    }

    useEffect(()=>{
        if (isJoinBtnActive){
            setactionsContainerClass("game-actions-container active")
        } else{
            setactionsContainerClass("game-actions-container")
        }
    },[isJoinBtnActive, isGameOfMine])
    
    return (
        <div className="game-preview-container"
            onClick={displayGame}
        >
            <div
                className="sidebar-item-preview"
                onClick={()=> setisJoinBtnActive
                    (!isJoinBtnActive)
                }
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
