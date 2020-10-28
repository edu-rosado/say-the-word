import React from 'react'
import { useState } from 'react'
import { Button, Form, InputGroup } from 'react-bootstrap'
import { useSelector } from 'react-redux'

export default function Chat() {

    const game  = useSelector(state => state.activeGame)

    return (
        <div className="m-chat">
            <div className="upper-container">
                <div className="game-info-actions">
                    game info and action
                </div>
                <div className="word-container">
                    word container
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
