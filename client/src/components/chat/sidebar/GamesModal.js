import React from 'react'
import { useEffect } from 'react';
import { useState } from 'react';
import { Button, Form, Modal } from "react-bootstrap";
import { useSelector } from 'react-redux';

export default function GamesModal() {
    const[title, setTitle] = useState("")
    const[hasPassword, setHasPassword] = useState(false)
    const[password, setPassword] = useState("")
    const[invitedFriends, setInvitedFriends] = useState([])
    const[nParticipants, setNParticipants] = useState(1)

    const isGuest = useSelector(state => state.user.isGuest)

    useEffect(()=>{
        if (nParticipants < 2){ // TODO: change to take on account the num of friends selected
            setNParticipants(2)
        } else if (nParticipants > 20){
            setNParticipants(20)
        }
    },[nParticipants])

    function handleSubmit(e){
        e.preventDefault()
        console.log(111)
    }

    function displayFriendsInput(){
        if (isGuest){
            return (
                <p className="text-muted text-center mb-4">As a guest user, you can't add friends to your account</p>
            )
        } else{
            return (
                <p>TODO</p>
            )
        }
    }

    return (
        <>
        <Modal.Header>Start a new game</Modal.Header>
        <Modal.Body className="game">
            <Form onSubmit={handleSubmit}>
                <Form.Group controlId="title">
                    <Form.Label>Game title</Form.Label>
                    <Form.Control type="text" required value={title} onChange={(e)=> setTitle(e.target.value)}/>
                </Form.Group>
                <Form.Label>Protect access with password</Form.Label>
                <div className="password-input-container">
                    <Form.Group controlId="hasPassword" className="check">
                        <Form.Control type="checkbox" checked={hasPassword} onChange={(e)=> setHasPassword(e.target.checked)}/>
                    </Form.Group>
                    <Form.Group controlId="password" className={hasPassword ? "password active" : "password"}>
                        <Form.Control type="password" checked={password} onChange={(e)=> setPassword(e.target.value)} placeholder="Type your password"/>
                    </Form.Group>
                </div>
                <Form.Group controlId="numOfFriends" >
                    <Form.Label>Invite friends</Form.Label>
                    {displayFriendsInput()}
                </Form.Group>
                <Form.Group  controlId="maxParticipants" className="number-of-participants">
                    <Form.Label>Maximum number of participants</Form.Label>
                    <Form.Control type="number" value={nParticipants} onChange={(e)=> setNParticipants(e.target.value)}/>
                </Form.Group>

                <Button type="submit" onSubmit={handleSubmit}>Create game</Button>
            </Form>
        </Modal.Body>
        </>
)}
