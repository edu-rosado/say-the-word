import React, { useState } from 'react'
import {Tab, Nav, Button, Modal} from 'react-bootstrap'
import GamesPane from './GamesPane'
import ContactsPane from './ContactsPane'

const GAMES_KEY = "GAMES"
const CONTACTS_KEY = "CONTACTS"

export default function Sidebar() {

    const [activeKey, setActiveKey] = useState(GAMES_KEY)

    return (
        <div className="m-sidebar">
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
