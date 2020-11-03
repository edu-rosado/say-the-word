import Axios from 'axios'
import React from 'react'
import { useRef } from 'react'
import { useEffect } from 'react'
import { useState } from 'react'
import { Button, Form, InputGroup } from 'react-bootstrap'
import { useDispatch, useSelector } from 'react-redux'
import { getTokenConfig } from '../../../actions/aux'
import { sendMessage } from '../../../actions/gameActions'
import { getWord } from '../../../actions/userActions'
import Message from './Message'

const SKIP_SECONDS = 10

export default function ActiveChat() {

    const [time, setTime] = useState("00:00")
    const [remainingseconds, setremainingseconds] = useState(0)
    const [intervalId, setintervalId] = useState(null)
    const [inputMsg, setInputMsg] = useState("")
    const [disableSkip, setdisableSkip] = useState(false)
    const [activeGame, setActiveGame] = useState( {
            title:"", messages:[], points:{},
    })
    const [points, setPoints] = useState(0)

    const {myGames,activeMineId}  = useSelector(state => state.games)
    const socket  = useSelector(state => state.socket)
    const {token, username, myWord}  = useSelector(state => state.user)
    const dispatch = useDispatch()

    const messagesEndRef = useRef()
    const scrollToBottom = ()=>{
        messagesEndRef.current.scrollIntoView({ behavior: 'smooth' })
    }

    useEffect(()=>{
        if (activeGame._id !== null && Object.keys(activeGame.points).includes(username)){
            setPoints(activeGame.points[username])
            scrollToBottom()
            if (myWord === null){
                dispatch(getWord(token, activeGame._id))
            }
        }
    },[activeGame])

    useEffect(() => {
        if (remainingseconds < 0){
            clearInterval(intervalId)
            setdisableSkip(false)
        }else{
            let minutes = Math.floor(remainingseconds/60)
            if (minutes < 10){
                minutes = `0${minutes}`
            }
            let seconds = Math.floor(remainingseconds%60)
            if (seconds < 10){
                seconds = `0${seconds}`
            }
            setTime(`${minutes}:${seconds}`)
        }
    }, [remainingseconds])

    useEffect(() => {
        if (activeMineId !== -1){
            const updatedGame = myGames.find(
                game => game._id === activeMineId
            )
            setPoints(updatedGame.points[username])
            scrollToBottom()   
            setActiveGame(updatedGame)
        }
    }, [activeMineId, myGames])
    
    const startTimer = ()=>{
        let intv = setInterval(() => {
            setremainingseconds(prev => prev - 1)
        }, 1000);
        setintervalId(intv)
    }

    const handleSkip = async () =>{
        const error = await dispatch(getWord(token, activeGame._id))
        if (error !== null){
            console.log(error)
        }
        setdisableSkip(true)
        setremainingseconds(SKIP_SECONDS)
        startTimer()
        
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
            <div className="title"><h3>{activeGame.title}</h3></div>
            <div className="points-box">
                <p>Points</p> <p className="points-num">{points}</p>
            </div>
            <i className="fas fa-address-book"></i>
        </div>
        <div className="word-container">
            <div className="word-box">
                <span>Your word: </span>
                <span className="word">{myWord}</span>
            </div>
            <div className="skip-box">
                <span>Time to skip: </span>
                <span className="time">{time}</span>
                <Button
                    disabled={disableSkip}
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
                        <i className="fas fa-paper-plane"></i>
                    </Button>
                </InputGroup.Append>
            </InputGroup>
        </Form>
    </div>
</div>
    )
}
