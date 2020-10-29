import React from 'react'
import { useState } from 'react'
import { Button, Form, InputGroup } from 'react-bootstrap'
import { useSelector } from 'react-redux'

export default function Chat() {

    const game  = useSelector(state => state.activeGame)

    const handleSkip = () =>{
        // TODO
    }

    return (
        <div className="m-chat">
            <div className="upper-container">
                <div className="game-info-actions">
                    <div className="title">{game.title}</div>
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
                msgs
            </div>
            <div className="input-container">
                <Form>
                    <InputGroup>
                        <Form.Control
                            as="textarea"
                            placeholder="Type some shit..."
                        ></Form.Control>
                        <InputGroup.Append>
                            <Button>
                                <i class="fas fa-paper-plane"></i>
                            </Button>
                        </InputGroup.Append>
                    </InputGroup>
                </Form>
            </div>
        </div>
    )
}
