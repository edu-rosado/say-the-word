import React from 'react'
import {Button, Form} from 'react-bootstrap'
import { Link } from 'react-router-dom'

export default function RegisterForm() {
    return (
        <>
        <Form>
            <Form.Group controlId="name">
                <Form.Label>Name</Form.Label>
                <Form.Control type="text" />
            </Form.Group>
            <Form.Group controlId="email">
                <Form.Label>Email</Form.Label>
                <Form.Control type="email" />
            </Form.Group>            
            <Form.Group controlId="password">
                <Form.Label>Password</Form.Label>
                <Form.Control type="password" />
            </Form.Group>
            <Form.Group controlId="password2">
                <Form.Label>Repeat password</Form.Label>
                <Form.Control type="password" />
            </Form.Group>            
            <Link to="/"><Button className="w-100">Register</Button></Link>
        </Form>
        </>
    )
}
