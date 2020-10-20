import React from 'react'

export default function GamePreview({name, participants}) {
    let participantString = participants.reduce(
        (myString, participant) => myString + `${participant}, `, ""
    ).slice(0, -2)
    return (
        <div className="sidebar-item-preview">
            <h3>{name}</h3>
            <p className="text-muted">{participantString}</p>
        </div>
    )
}
