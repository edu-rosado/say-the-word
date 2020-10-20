import React, { useState } from 'react'
import {Tab, Nav, Button, Modal} from 'react-bootstrap'
import GamesPane from './GamesPane'
import ContactsPane from './ContactsPane'
import {useDispatch, useSelector} from 'react-redux'
import { logoutUser } from '../../../actions/userActions'
import { LOCAL_STORAGE_KEY } from '../../App'
import { useHistory } from 'react-router-dom'

const GAMES_KEY = "GAMES"
const CONTACTS_KEY = "CONTACTS"

export default function Sidebar() {

    const [activeKey, setActiveKey] = useState(GAMES_KEY)
    const username = useSelector(state => state.user.username)
    const dispatch = useDispatch()
    const history = useHistory()

    const handleLogout = ()=>{
        dispatch(logoutUser())
        localStorage.removeItem(LOCAL_STORAGE_KEY)
        history.push("/")
    }

    return (
        <div className="m-sidebar">
            <div className="account-section">
                <h2>{username}</h2>
                <div className="user-controls">
                    <img src="https://i.ytimg.com/vi/oHg5SJYRHA0/hqdefault.jpg" alt=""/>
                    <i class="fas fa-cogs fa-lg"></i>
                    <i onClick={handleLogout} class="fas fa-door-open fa-lg"></i>
                </div>
            </div>
            <Tab.Container activeKey={activeKey} onSelect={setActiveKey}>
                <Nav variant="pills">
                    <Nav.Item>
                        <Nav.Link 
                            eventKey={GAMES_KEY}
                        >Games
                        </Nav.Link>
                    </Nav.Item>
                    <Nav.Item>
                        <Nav.Link 
                            eventKey={CONTACTS_KEY}
                        >Contacts
                        </Nav.Link>
                    </Nav.Item>
                </Nav>
                <Tab.Content>
                    <Tab.Pane eventKey={GAMES_KEY}>
                        <GamesPane/>
                    </Tab.Pane>
                    <Tab.Pane eventKey={CONTACTS_KEY}>
                        <ContactsPane/>
                    </Tab.Pane>
                </Tab.Content>
            </Tab.Container>
        </div>
    )
}
