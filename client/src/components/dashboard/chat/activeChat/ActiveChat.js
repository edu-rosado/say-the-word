import React from 'react'
import { useRef } from 'react'
import { useEffect } from 'react'
import { useState } from 'react'
import { Button, Form, InputGroup } from 'react-bootstrap'
import Media from 'react-media'
import { useDispatch, useSelector } from 'react-redux'
import { Link } from 'react-router-dom'
import { sendMessage } from '../../../../actions/gameActions'
import Message from '../Message'
import IngameBar from './multiInfoBar/IngameBar'
import PostgameBar from './multiInfoBar/PostgameBar'
import PostgameBar_host from './multiInfoBar/PostgameBar'
import StartBar from './multiInfoBar/StartBar'
import StartBar_host from './multiInfoBar/StartBar_host'

const SKIP_SECONDS = 10
export const GAME_STATUS_WAITING = "GAME_STATUS_WAITING"
export const GAME_STATUS_GOING = "GAME_STATUS_GOING"
export const GAME_STATUS_ENDED = "GAME_STATUS_ENDED"

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
    const [multiInfoBar, setMultiInfoBar] = useState(null)

    const {myGames,activeMineId}  = useSelector(state => state.games)
    const socket  = useSelector(state => state.socket)
    const {token, username}  = useSelector(state => state.user)
    const dispatch = useDispatch()

    const messagesEndRef = useRef()
    const scrollToBottom = ()=>{
        messagesEndRef.current.scrollIntoView({ behavior: 'smooth' })
    }

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
            setActiveGame({...updatedGame})
        }
    }, [activeMineId, myGames])

    useEffect(() => {
        if (activeGame._id === null){
            return
        }
        console.log(activeGame)
        setPoints(activeGame.points[username])
        scrollToBottom()
        switch(activeGame.status){
            case GAME_STATUS_WAITING:
                if (activeGame.host === username){
                    setMultiInfoBar(<StartBar_host          
                        gameId={activeGame._id}
                        setMultiInfoBar={setMultiInfoBar}
                    />)
                } else{
                    setMultiInfoBar(<StartBar/>)
                }
                break
            case GAME_STATUS_GOING:
                setMultiInfoBar(<IngameBar
                    activeGame={activeGame}
                    setMultiInfoBar={setMultiInfoBar}
                />)
                break
            case GAME_STATUS_ENDED:
                setMultiInfoBar(<PostgameBar
                    activeGame={activeGame}
                />)
                break
            default:
                break
        }
    }, [activeGame])
    
    const startTimer = ()=>{
        let intv = setInterval(() => {
            setremainingseconds(prev => prev - 1)
        }, 1000);
        setintervalId(intv)
    }

    const handleSkip = async () =>{
        setdisableSkip(true)
        setremainingseconds(SKIP_SECONDS)
        startTimer()
        
    }
    const handleSubmit = async () => {
        const error = await dispatch(sendMessage(
            token,
            activeGame._id,
            inputMsg,
            socket,
            activeGame.role === "impostor"
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
             <Link to="/">
                <i className="fas fa-arrow-circle-left back"></i>
             </Link>
            <div className="title"><h3>{activeGame.title}</h3></div>
            <div className="points-box">
                <p>Points</p> <p className="points-num">{points}</p>
            </div>
            <Media query="(max-width: 768px)">
                <i className="fas fa-ellipsis-v menu"></i>
            </Media>
        </div>
        {multiInfoBar}
    </div>
    <div className="messages-container">
        {activeGame.messages.map(msg => (
            <Message
                key={msg.date}
                author={msg.author}
                text={msg.text}
                date={msg.date}
                authorIsSelf={msg.author === username}
                isImpostor={activeGame.role === "impostor"}
                impostorFriend={activeGame.impostorFriend}
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
