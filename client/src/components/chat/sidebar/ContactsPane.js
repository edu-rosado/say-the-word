import React, { useState } from 'react'
import { Nav, Tab } from 'react-bootstrap'
import ContactPreview from './ContactPreview'

const FRIENDS_KEY = "FRIENDS_KEY"
const ONLINE_KEY = "ONLINE_KEY"

export default function ContactsPane() {
    const [activeKey, setActiveKey] = useState(ONLINE_KEY)
    return (
        <div className="tab-pane-content contacts">
            <Tab.Container activeKey={activeKey} onSelect={setActiveKey}>
                <div className="inter-nav-space"></div>
                <Nav variant="pills">
                    <Nav.Item>
                        <Nav.Link eventKey={ONLINE_KEY}>Online</Nav.Link>
                    </Nav.Item>
                    <Nav.Item>
                    <Nav.Link eventKey={FRIENDS_KEY}>Friends</Nav.Link>
                    </Nav.Item>
                </Nav>
                <Tab.Content>
                    <Tab.Pane eventKey={ONLINE_KEY}>
                        <ContactPreview name="Chufi" statusMessage="Sonrie y todo saldrá bien"/>
                        <ContactPreview name="Manolito" statusMessage="Epaaaaaa"/>
                        <ContactPreview name="Rocodrilo" statusMessage="Atleti de mi corazooon"/>
                    </Tab.Pane>
                    <Tab.Pane eventKey={FRIENDS_KEY}>
                       <ContactPreview name="Chufi2" statusMessage="Sonrie y todo saldrá bien"/>
                        <ContactPreview name="Manolito2" statusMessage="Epaaaaaa"/>
                        <ContactPreview name="Rocodrilo2" statusMessage="Atleti de mi corazooon"/>
                    </Tab.Pane>
                </Tab.Content>
            </Tab.Container>
        </div>
    )
}
