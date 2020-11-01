import React from 'react'
import { useRef } from 'react'
import { useEffect } from 'react'
import { useState } from 'react'
import { Button, Form, InputGroup } from 'react-bootstrap'
import { useDispatch, useSelector } from 'react-redux'
import { sendMessage } from '../../../actions/gameActions'
import Message from './Message'

export default function ActiveChat() {

    const [inputMsg, setInputMsg] = useState("")
    const [activeGame, setActiveGame] = useState({
        title:"", messages:[],
    })

    const {myGames,activeMineId}  = useSelector(state => state.games)
    const socket  = useSelector(state => state.socket)
    const {token, username}  = useSelector(state => state.user)
    const dispatch = useDispatch()

    const messagesEndRef = useRef()
    const scrollToBottom = ()=>{
        messagesEndRef.current.scrollIntoView({ behavior: 'smooth' })
    }

    useEffect(()=>{
        scrollToBottom()
    },[])

    useEffect(() => {
        if (activeMineId !== -1){
            setActiveGame(myGames.find(
                game => game._id === activeMineId
            ))
        }
    }, [activeMineId])
    

    const handleSkip = () =>{
        // TODO
    }
    const handleSubmit = async () => {
        const error = await dispatch(sendMessage(
            token, activeGame._id, inputMsg, socket
        ))
        if (error){
            console.log(error.response.data)
        }
        setInputMsg("")
        scrollToBottom()
    }
    const handleKeyUp = (e) =>{
        if (e.key === 'Enter'){
            handleSubmit()
        }
    }

    return (
<div className="m-chat">
    <div className="upper-container">
        <div className="game-info-actions">
            <div className="title">{activeGame.title}</div>
            <i class="fas fa-address-book"></i>
        </div>
        <div className="word-container">
            <div className="word-box">
                <span>Your word: </span>
                <span className="word">XXXXXXX</span>
            </div>
            <div className="skip-box">
                <span>Time to skip: </span>
                <span className="time">01:30</span>
                <Button
                    disabled={true}
                    className="skip-btn"
                    onClick={handleSkip}
                >Skip word</Button>
            </div>
        </div>
    </div>
    <div className="messages-container">
        {activeGame.messages.map(msg => (
            <Message
                key={msg.date}
                author={msg.author}
                text={msg.text}
                date={msg.date}
                authorIsSelf={msg.author === username}
            />
        ))}
        <div ref={messagesEndRef} />
    </div>
    <div className="input-container">
        <Form>
            <InputGroup>
                <Form.Control
                    as="textarea"
                    placeholder="Type here..."
                    value={inputMsg}
                    onChange={(e)=>setInputMsg(e.target.value)}
                    onKeyUp={handleKeyUp}
                ></Form.Control>
                <InputGroup.Append>
                    <Button onClick={handleSubmit}>
                        <i class="fas fa-paper-plane"></i>
                    </Button>
                </InputGroup.Append>
            </InputGroup>
        </Form>
    </div>
</div>
    )
}
