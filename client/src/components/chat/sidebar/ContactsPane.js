import React, { useEffect, useState } from 'react'
import { Nav, Tab } from 'react-bootstrap'
import { useDispatch, useSelector } from 'react-redux'
import { getOnlineContacts, getFriends } from '../../../actions/ContactsFriendsActions'
import ContactPreview from './ContactPreview'

const FRIENDS_KEY = "FRIENDS_KEY"
const ONLINE_KEY = "ONLINE_KEY"

export default function ContactsPane() {
    const [activeKey, setActiveKey] = useState(ONLINE_KEY)
    const onlineContacts = useSelector(state => state.contacts.online)
    const friends = useSelector(state => state.friends)
    const {token, username} = useSelector(state => state.user)
    const dispatch = useDispatch()

    useEffect(()=>{
        if (activeKey === ONLINE_KEY){
            dispatch(getOnlineContacts(token))
        } else{
            dispatch(getFriends(token))
        }
    },[activeKey])
    
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
                        {onlineContacts
                            .filter(contact => contact !== username)
                            .map(contact => (
                            <ContactPreview 
                            key={contact}
                            name={contact}
                            />
                        ))}
                    </Tab.Pane>
                    <Tab.Pane eventKey={FRIENDS_KEY}>
                    {friends.map(friend => (
                            <ContactPreview 
                            key={friend}
                            name={friend}
                            />
                        ))}
                    </Tab.Pane>
                </Tab.Content>
            </Tab.Container>
        </div>
    )
}
