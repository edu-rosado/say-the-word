import Axios from 'axios'
import React from 'react'
import { useRef } from 'react'
import { useEffect } from 'react'
import { useState } from 'react'
import { Button, Form, InputGroup } from 'react-bootstrap'
import { useDispatch, useSelector } from 'react-redux'
import { getTokenConfig } from '../../../actions/aux'
import { sendMessage } from '../../../actions/gameActions'
import Message from './Message'

const SKIP_SECONDS = 5

export default function ActiveChat() {

    const [myWord, setmyWord] = useState(null)
    const [time, setTime] = useState("1:30")
    const [remainingseconds, setremainingseconds] = useState(SKIP_SECONDS)
    const [inputMsg, setInputMsg] = useState("")
    const [disableSkip, setdisableSkip] = useState(true)
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

    let intv = null

    useEffect(()=>{
        scrollToBottom()
        const error = getWord()
        if (error !== null){
            console.log(error)
        }
        startTimer()
        return () => clearInterval(intv)
    },[])

    const startTimer = ()=>{
        intv = setInterval(() => {
            setremainingseconds(prev => prev - 1)
        }, 1000);
    }

    useEffect(() => {
        if (remainingseconds < 0){
            clearInterval(intv)
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
            setActiveGame(myGames.find(
                game => game._id === activeMineId
            ))
        }
    }, [activeMineId])
    

    const getWord = async() =>{
        const config = getTokenConfig(token)
        return await Axios.get("/api/words/random", config)
            .then(res => {
                setmyWord(res.data.word)
                return null
            })
            .catch(err => err)
    }
    const handleSkip = () =>{
        const error = getWord()
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
            <div className="title">{activeGame.title}</div>
            <i class="fas fa-address-book"></i>
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
                        <i class="fas fa-paper-plane"></i>
                    </Button>
                </InputGroup.Append>
            </InputGroup>
        </Form>
    </div>
</div>
    )
}
