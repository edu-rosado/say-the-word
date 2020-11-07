import React from 'react'
import { useEffect } from 'react'
import { useState } from 'react'
import { Button } from 'react-bootstrap'
import { useSelector } from 'react-redux'
import VotingModal from '../VotingModal'

export default function IngameBar({activeGame, setMultiInfoBar}) {
    const {participants, _id, host, role, impostorFriend} = activeGame

    const [modalIsOpen, setmodalIsOpen] = useState(false)

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
        <Button onClick={()=>setmodalIsOpen(true)}>Vote</Button>
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
