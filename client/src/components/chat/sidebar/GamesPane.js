import React from 'react'
import { Button } from 'react-bootstrap'
import GamePreview from './GamePreview'

export default function GamesPane() {
    return (
        <>
            <div className="game-list">
            <GamePreview name="my game" participants={["mika", "Jagger", "joe"]}/>
                        <GamePreview name="my game 2" participants={["Durint", "Hurin", "Fëanor"]}/>
            </div>
            <div className="side-action-container">
            <Button className="side-action-btn">Create a new game</Button>
            <Button className="side-action-btn">Join game</Button>
            </div>
                        
        </>
    )
}
