import React from 'react'
import { useEffect } from 'react'
import { useState } from 'react'
import { Button } from 'react-bootstrap'
import { useSelector } from 'react-redux'
import VotingModal from '../VotingModal'

export default function IngameBar({activeGame, setMultiInfoBar}) {
    const {participants, _id, host, roles, impostorFriend} = activeGame

    const [role, setRole] = useState(null)
    const [modalIsOpen, setmodalIsOpen] = useState(false)
    const [isBtnDisabled, setIsBtnDisabled] = useState(true)
    const [btnText, setBtnText] = useState("Vote")

    const username = useSelector(state => state.user.username)

    useEffect(() => {
        if ((roles !== undefined) && 
            (username !== undefined)){
            setRole(roles[username])
        }
    }, [roles, username])
    
    useEffect(() => {
        console.log(role)
        if ((role !== null) && 
            (role !== "impostor")){
            setIsBtnDisabled(activeGame.votes[username].length != 0)
        }
    }, [username, role])

    useEffect(() => {
        if (isBtnDisabled) {setBtnText("Waiting for others to vote")}
        else{setBtnText("Vote")}
    }, [isBtnDisabled])

    const handleVote = () => {
        if (!isBtnDisabled){
            setmodalIsOpen(true)
            setIsBtnDisabled(true)
        }
        
    }
    
    return (
<div className="multi-info-bar with-action">
    { role === "impostor" ? (<> {/* if ... */}
        <p>You are an impostor</p>
        <p>
            You must impersonate
            <span>{impostorFriend}</span>
            and viceversa. Work together!
        </p>
    </>) : (<> {/* Else... */}
        <p>You are an your true self</p>
        <p>Find both impostors!</p>
        <Button
            onClick={handleVote}
            disabled={isBtnDisabled}
        >{btnText}</Button>
        <VotingModal
            modalIsOpen={modalIsOpen}
            setmodalIsOpen={setmodalIsOpen}
            participants={participants}
            gameId={_id}
            setMultiInfoBar={setMultiInfoBar}
            host={host}
        />
    </>)}
</div>
    )
}
