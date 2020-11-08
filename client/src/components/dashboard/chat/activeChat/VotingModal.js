import React from 'react'
import { useState } from 'react'
import { Button, Form, Modal } from 'react-bootstrap'
import { useDispatch, useSelector } from 'react-redux'
import { castVotesApi } from '../../../../actions/gameActions'
import ContactPreview from '../../sidebar/ContactPreview'
import PostgameBar from './multiInfoBar/PostgameBar'
import PostgameBar_host from './multiInfoBar/PostgameBar'

export default function VotingModal({
    modalIsOpen, setmodalIsOpen, participants, gameId, host, setMultiInfoBar
}) {

    const [selectedItems, setselectedItems] = useState([])
    const {username, token} = useSelector(state => state.user)
    const socket = useSelector(state => state.socket)
    const dispatch = useDispatch()

    const handleSelectItem = (e) =>{
        const username = e.target.getAttribute("data-name")
        const active = e.target.getAttribute("data-active")
        if (active === "true"){
            setselectedItems(prev => (
                prev.filter(name => name !== username)
            ))
        } else if (selectedItems.length < 2){
            setselectedItems(prev => [...prev, username])
        }
    }

    const handleSubmit = async () =>{
        const error = await dispatch(castVotesApi(token, gameId, socket, selectedItems, username))
        if (error !== null){
            console.log(error)
        } else {
            setmodalIsOpen(false)
        }
    }

    return (
        <Modal
            show={modalIsOpen}
            onHide={()=>setmodalIsOpen(false)}
        >
            <Modal.Header>Select 2 impostors</Modal.Header>
            <Modal.Body>
                <div className="contact-list"
                    onClick={handleSelectItem}
                >
                    {participants
                        .filter(friendName => (
                            friendName !== username
                        ))
                        .map(friendName => (
                        <ContactPreview
                            key={friendName}
                            name={friendName}
                            selectedItems={selectedItems}
                        />
                    ))}
                </div>
                <Button onClick={handleSubmit}>Vote</Button>
            </Modal.Body>
        </Modal>
    )
}
