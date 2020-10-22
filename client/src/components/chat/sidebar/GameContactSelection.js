import React, { useState } from 'react'
import { Nav, Tab } from 'react-bootstrap'
import ContactPreview from './ContactPreview'

const FRIENDS_KEY = "FRIENDS_KEY"

export default function GameContactSelection({setParticipants}) {

    function handleParticipantClick(e){
        const username = e.target.getAttribute("data-name")
        if(e.target.getAttribute("data-active") === "true"){
            // add
            setParticipants(prev=> [...prev, username])            
        } else{
            // remove
            setParticipants(prev=> 
                prev.filter(element => 
                    element != username))
        }
    }
    
    return (
        <div className="new-game-contacts">
            <input className="contacts-input" type="text" placeholder="search NOT IMPLEMENTED..."/>
            <div className="game-participant-container">
                <div className="game-participant-choice-list" onClick={handleParticipantClick}>
                    <ContactPreview name="Mike"/>
                    <ContactPreview name="Demeter"/>
                </div>
            </div>
        </div>
    )
}