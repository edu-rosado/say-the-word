import React, { useState } from 'react'
import { useEffect } from 'react'
import { Button, Modal, Nav, Tab } from 'react-bootstrap'
import { useSelector,useDispatch } from 'react-redux'
import { getGames } from '../../../actions/gameActions'
import GamePreview from './GamePreview'
import GameModal from './modals/GameModal'
import { GAMES_KEY } from './Sidebar'

const MY_GAMES_KEY = "MY_GAMES_KEY"
const ALL_GAMES_KEY = "ALL_GAMES_KEY"

export default function GamesPane({parentActiveKey}) {
    
    const [activeKey, setActiveKey] = useState(ALL_GAMES_KEY)
    const [modalIsOpen, setModalIsOpen] = useState(false)

    const {token, username} = useSelector(state => state.user)
    const {myGames, notMyGames} = useSelector(state => state.games)
    const dispatch = useDispatch()

    useEffect(()=>{
        if (parentActiveKey == GAMES_KEY){
            dispatch(getGames(token, username))
        }
    },[parentActiveKey])
    
    return (
        <div className="tab-pane-content games">
            <Tab.Container activeKey={activeKey} onSelect={setActiveKey}>
                <div className="inter-nav-space"></div>
                <Nav variant="pills">
                    <Nav.Item>
                        <Nav.Link eventKey={MY_GAMES_KEY}>My games</Nav.Link>
                    </Nav.Item>
                    <Nav.Item>
                    <Nav.Link eventKey={ALL_GAMES_KEY}>All games</Nav.Link>
                    </Nav.Item>
                </Nav>
                <Tab.Content>
                    <Tab.Pane 
                        eventKey={MY_GAMES_KEY}
                        className="game-list"
                    >
                        {myGames.map(game => (
                            <GamePreview
                            key={game._id}
                            _id={game._id}
                            title={game.title}
                            participants={game.participants}
                            hasPassword={game.hasPassword}
                            maxParticipants={game.maxParticipants}
                            isGameOfMine={true}
                            />
                        ))}
                    </Tab.Pane>
                    <Tab.Pane 
                        eventKey={ALL_GAMES_KEY}
                        className="game-list"
                    >
                        {notMyGames.map(game => (
                            <GamePreview
                            key={game._id}
                            _id={game._id}
                            title={game.title}
                            participants={game.participants}
                            hasPassword={game.hasPassword}
                            maxParticipants={game.maxParticipants}
                            isGameOfMine={false}
                            />
                        ))}
                    </Tab.Pane>
                </Tab.Content>
            </Tab.Container>

            


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
