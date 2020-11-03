import React from 'react'
import { useState } from 'react';
import { Button, Form, Modal } from "react-bootstrap";
import { useDispatch, useSelector } from 'react-redux';
import { createGame, setMineActiveId } from '../../../../actions/gameActions';
import GameContactSelection from './GameParticipantSelection';
import {MY_GAMES_KEY} from '../GamesPane'

export default function GamesModal({setActiveKey}) {
    const[title, setTitle] = useState("")
    const[hasPassword, setHasPassword] = useState(false)
    const[password, setPassword] = useState("")
    const[participants, setParticipants] = useState([])
    const[maxParticipants, setMaxParticipants] = useState(2)
    const [affectedField, setAffectedField] = useState("")
    const [errorMsg, setErrorMsg] = useState("")
    
    const token = useSelector(state=> state.user.token)
    const dispatch = useDispatch()

    async function handleSubmit(e){
        e.preventDefault()
        let {id, error} = await dispatch(
            createGame(token, {
                title, hasPassword, password, participants, maxParticipants
            }))
            
        if (error){
            setErrorMsg(error)
            if (error.indexOf("title") >= 0) {
                setAffectedField("title")
            }
            else if (error.indexOf("password") >= 0) {
                setAffectedField("password")
            } else{
                error = error.replace('"maxParticipants"', "Max. participants number")
                setAffectedField("maxParticipants")
            }
        } else{
            dispatch(setMineActiveId(id))
            setActiveKey(MY_GAMES_KEY)
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
                    {affectedField === "title" ?
                        (<span className="text-danger"> {errorMsg} </span>)
                    : ""}                    
                </Form.Group>
                <Form.Label>Protect access with password</Form.Label>
                <div className="password-input-container">
                    <Form.Group controlId="hasPassword" className="check">
                        <Form.Control type="checkbox" checked={hasPassword} onChange={(e)=> setHasPassword(e.target.checked)}/>
                    </Form.Group>
                    <Form.Group controlId="password" className={hasPassword ? "password active" : "password"}>
                        <Form.Control type="password" checked={password} onChange={(e)=> setPassword(e.target.value)} placeholder="Type your password"/>
                        {affectedField === "password" ?
                            (<span className="text-danger"> {errorMsg} </span>)
                        : ""}  
                    </Form.Group>
                </div>
                <Form.Group controlId="numOfFriends" >
                    <Form.Label>Invite friends</Form.Label>
                    <GameContactSelection setParticipants={setParticipants}/>
                </Form.Group>
                <Form.Group  controlId="maxParticipants" className="number-of-participants">
                    <Form.Label>Maximum number of participants (2 to 10)</Form.Label>
                    <Form.Control type="number" value={maxParticipants} onChange={(e)=> setMaxParticipants(e.target.value)}/>
                    {affectedField === "maxParticipants" ?
                            (<span className="text-danger"> {errorMsg} </span>)
                        : ""}  
                </Form.Group>

                <Button type="submit" onSubmit={handleSubmit}>Create game</Button>
            </Form>
        </Modal.Body>
        </>
)}
