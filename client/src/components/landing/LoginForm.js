import React from 'react'
import {Button, Form} from 'react-bootstrap'
import { Link } from 'react-router-dom'

export default function LoginForm() {
    return (
        <>
        <Form>
            <Form.Group controlId="name">
                <Form.Label>Name</Form.Label>
                <Form.Control type="text" />
            </Form.Group>
            <Form.Group controlId="password">
                <Form.Label>Password</Form.Label>
                <Form.Control type="password" />
            </Form.Group>
            <Link to="/"><Button className="w-100">Login</Button></Link>
        </Form>
        </>
    )
}
