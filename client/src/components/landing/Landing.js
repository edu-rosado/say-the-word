import React, { useState } from 'react'
import LoginForm from './LoginForm'
import RegisterForm from './RegisterForm'
import {Form, Button} from 'react-bootstrap'

export default function Landing() {

    const [displayLogin,setDisplayLogin] = useState(true) // true: login, false: register

    return (
<div className="m-login">
    <h1>Say the word</h1>
    <h2>Let the mind games begin</h2>
    <div className="login-options">
    <div className="m-ghost-card">
        
        <div className="switch-container">
            <span className={displayLogin? "login-label mr-2": "login-label mr-2 active"}>Register</span>
            <div class="custom-control custom-switch">
                <input type="checkbox" class="custom-control-input input-lg" id="login-switch" checked={displayLogin} onChange={()=>setDisplayLogin(!displayLogin)} />
                <label class="custom-control-label" for="login-switch">        
                </label>
            </div>
            <span className={displayLogin? "login-label mr-2 active": "login-label mr-2"}>Login</span>
        </div>
        {displayLogin? <LoginForm/> : <RegisterForm/>}
    </div>
        
    <div className="m-ghost-card">
        <h3 className="text-center mb-4">Don't want an account?</h3>
        <Form>
                <Form.Group controlId="username">
                        <Form.Label>Pick a name</Form.Label>
                        <Form.Control type="text" value="Pelícano salvaje"/>
                    </Form.Group>
                <Button className="w-100">Access as a guest</Button>
            </Form>
            <p className="px-2 mt-1" style={{fontSize: "1rem"}}>You won't be able to save contacts or games</p>   
    </div>
    </div>
</div>
    )
}
