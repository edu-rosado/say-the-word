import React from 'react'
import { useEffect } from 'react'
import { useState } from 'react'
import { Button } from 'react-bootstrap'
import { useDispatch, useSelector } from 'react-redux'
import { startGameApi } from '../../../../../actions/gameActions'

export default function PostgameBar({activeGame}) {

    const [impostors, setImpostors] = useState([])
    const [catchersList, setCatchersList] = useState([])

    const {token, username} = useSelector(state => state.user)
    const socket = useSelector(state => state.socket)
    const dispatch = useDispatch()

    const handleStart = async () =>{
        const error = await dispatch(startGameApi(token, activeGame.gameId, socket, username))
        if (error !== null){
            console.log(error)
        } else{
            // setMultiInfoBar(<IngameBar/>)
        }
    }

    useEffect(() => {
        const impostorNames = Object
            .entries(activeGame.allRoles)
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

    }, [])

    return (
<div className="multi-info-bar end">
    <div className="game-summary">
        <div className="roles-info">
            <p>The impostors were</p>
            <p><span>{impostors[0]}</span>and<span>{impostors[1]}</span></p>
            <div className="catchers">
                <p>Who caught <span>{impostors[0]}</span>?</p>
                <p>{catchersList[0]}</p>
            </div>
            <div className="catchers">
                <p>Who caught <span>{impostors[1]}</span>?</p>
                <p>{catchersList[1]}</p>
            </div>
        </div>
        <div className="points-info">
            {Object.entries(activeGame.points)
                .map(([name,points]) => (
                    <p>{name}: {points}p</p>
                ))}
        </div>
    </div>

    <Button
        variant="success"
        onClick={handleStart}
    >Start a new game</Button>
</div>
    )
}
