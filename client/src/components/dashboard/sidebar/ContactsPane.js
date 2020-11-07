import React, { useEffect, useState } from 'react'
import { Button, Modal, Nav, Tab } from 'react-bootstrap'
import { useDispatch, useSelector } from 'react-redux'
import { getOnlineContacts, getFriends } from '../../../actions/ContactsFriendsActions'
import ContactPreview from './ContactPreview'
import FriendModal from "./modals/FriendModal"
import {CONTACTS_KEY} from './Sidebar'

const FRIENDS_KEY = "FRIENDS_KEY"
const ONLINE_KEY = "ONLINE_KEY"

export default function ContactsPane({parentActiveKey}) {
    const [activeKey, setActiveKey] = useState(ONLINE_KEY)
    const [modalIsOpen, setModalIsOpen] = useState(false)

    const onlineContacts = useSelector(state => state.contacts.online)
    const friends = useSelector(state => state.user.friends)
    const {token, username} = useSelector(state => state.user)
    const dispatch = useDispatch()

    useEffect(()=>{
        if (parentActiveKey == CONTACTS_KEY){
            if (activeKey === ONLINE_KEY){
                dispatch(getOnlineContacts(token))
            } else{
                dispatch(getFriends(token))
            }
        }
    },[parentActiveKey,activeKey])

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
                            selectedItems={[]}
                            />
                        ))}
                    </Tab.Pane>
                    <Tab.Pane eventKey={FRIENDS_KEY}>
                    {friends.map(friend => (
                            <ContactPreview 
                            key={friend}
                            name={friend}
                            selectedItems={[]}
                            />
                        ))}
                    </Tab.Pane>
                </Tab.Content>
            </Tab.Container>

            <div className="side-action-container">
                <Button
                    onClick={()=>setModalIsOpen(true)}
                >Add a new friend</Button>
            </div>

            <Modal className="friend-modal" show={modalIsOpen} onHide={()=>setModalIsOpen(false)}>
                <FriendModal setModalIsOpen={setModalIsOpen}/>
            </Modal>
        </div>
    )
}
