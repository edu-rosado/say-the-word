import React, { useState } from 'react'
import { Button, Modal } from 'react-bootstrap'
import { useSelector } from 'react-redux'
import GamePreview from './GamePreview'
import GameModal from './modals/GameModal'

export default function GamesPane({setDoLogout}) {
    
    const games = useSelector(state => state.games)
    
    const [modalIsOpen, setModalIsOpen] = useState(false)
    return (
        <div className="tab-pane-content games">
            <div className="game-list">
                {games.map(game => (
                    <GamePreview
                    key={game._id}
                    name={game.title}
                    participants={game.participants}
                    hasPassword={game.hasPassword}
                    maxParticipants={game.maxParticipants}
                    />
                ))}
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
