import React, { useState } from 'react'
import { Button, Modal } from 'react-bootstrap'
import GamePreview from './GamePreview'
import GameModal from './modals/GameModal'

export default function GamesPane() {
    const [modalIsOpen, setModalIsOpen] = useState(false)
    return (
        <div className="tab-pane-content games">
            <div className="game-list">
                <GamePreview name="my game" participants={["mika", "Jagger", "joe"]}/>
                <GamePreview name="my game 2" participants={["Durint", "Hurin", "Fëanor"]}/>
            </div>
            <div className="side-action-container">
            <Button 
                onClick={()=>setModalIsOpen(true)} 
            >Create a new game</Button>

            {/* Future feature */}
            <Button 
            >Join game by id</Button>

            </div>

            <Modal className="game-modal" show={modalIsOpen} onHide={()=>setModalIsOpen(false)}>
                <GameModal/>
            </Modal>
                        
        </div>
    )
}
