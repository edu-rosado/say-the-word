import React from 'react'
import {Button, Form} from 'react-bootstrap'
import {Link} from 'react-router-dom'

export default function Login() {
    return (
<div className="m-login">
    <h1>Say the word</h1>
    <h2>Let the mind games begin</h2>
    <div className="login-options">
    <div className="m-ghost-card">
        <Form>
            <Form.Group controlId="name">
                <Form.Label>Name</Form.Label>
                <Form.Control type="text" />
            </Form.Group>
            <Form.Group controlId="password">
                <Form.Label>Password</Form.Label>
                <Form.Control type="password" />
            </Form.Group>
        </Form>
        <Button className="w-100">Login</Button>
        <p className="mt-2">Don't have an account? <a className="">Sign up</a></p>
    </div>
        
    <div className="m-ghost-card">
        <h3 className="text-center mb-4">Don't want an account?</h3>
        <Button className="w-100">Access as a guest</Button>
        <p className="px-2 mt-1" style={{fontSize: "1rem"}}>You won't be able to save contacts or games</p>
    </div>
    </div>
</div>
    )
}
