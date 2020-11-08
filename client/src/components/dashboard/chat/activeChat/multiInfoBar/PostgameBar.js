import React from 'react'
import { useEffect } from 'react'
import { useState } from 'react'
import { Button } from 'react-bootstrap'
import { useDispatch, useSelector } from 'react-redux'
import { joinFollowUpApi, startGameApi } from '../../../../../actions/gameActions'

export default function PostgameBar({activeGame}) {

    const [impostors, setImpostors] = useState([])
    const [catchersList, setCatchersList] = useState([[],[]])
    const [btnText, setBtnText] = useState("Join next game")
    const [isBtnDisabled, setIsBtnDisabled] = useState(false)

    const {token, username} = useSelector(state => state.user)
    const socket = useSelector(state => state.socket)
    const dispatch = useDispatch()

    useEffect(() => {
        if (activeGame !== null){
            const impostorNames = Object
            .entries(activeGame.roles)
            .filter(entry => entry[1] === "impostor")
            .map(entry => entry[0])
        setImpostors(impostorNames)
        setCatchersList(
            impostorNames
                .map(impostor => {
                    return Object
                        .entries(activeGame.votes)
                        .filter(([voter,votes]) => (
                            votes.includes(impostor)
                        ))
                        .map(entry => entry[0])
                })
                .map(catchers => catchers.toString())
        )
        }
    }, [activeGame])

    const handleJoin = async () =>{
        if (!isBtnDisabled){
            dispatch(joinFollowUpApi(
                activeGame._id, username, token, socket
            ))
            setBtnText("Waiting for the others to join")
            setIsBtnDisabled(true)
        }
    }
    
    return (
<div className="multi-info-bar end">
    <div className="game-summary">
        <div className="roles-info">
            <div className="impostors-text">
                <p>The impostors were</p>
                <p><span>{impostors[0]}</span>and<span>{impostors[1]}</span></p>
            </div>
            <div className="catchers">
                <p>Who caught <span>{impostors[0]}</span>?</p>
                {
                    catchersList[0].length > 0
                    ? <p>{catchersList[0]}</p>
                    : (<p>Nobody, well done!</p>)
                }
            </div>
            <div className="catchers">
                <p>Who caught <span>{impostors[1]}</span>?</p>
                {
                    catchersList[1].length > 0
                    ? <p>{catchersList[1]}</p>
                    : (<p>Nobody!</p>)
                }
            </div>
        </div>
        <div className="points-info">
            {Object.entries(activeGame.points)
                .map(([name,points]) => (
                    <p>{name}: <span className="point">{points}p</span></p>
                ))}
        </div>
    </div>

    <Button
        variant="success"
        onClick={handleJoin}
        disabled={isBtnDisabled}
    >{btnText}</Button>
</div>
    )
}
