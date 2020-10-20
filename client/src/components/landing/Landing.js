import React, { useState } from 'react'
import LoginForm from './LoginForm'
import RegisterForm from './RegisterForm'
import GuestForm from './GuestForm'

export default function Landing() {

    const [displayLogin,setDisplayLogin] = useState(true) // true: login, false: register

    return (
<div className="m-login">
    <h1>Say the word</h1>
    <h2>Let the mind games begin</h2>
    <div className="login-options">
    <div className="m-ghost-card">
        
        <div className="switch-container">
            <span className={displayLogin? "login-label mr-2": "login-label mr-2 active"}  onClick={()=>setDisplayLogin(false)}>Register</span>
            <div className="custom-control custom-switch">
                <input type="checkbox" className="custom-control-input input-lg" id="login-switch" checked={displayLogin} onChange={()=>setDisplayLogin(!displayLogin)} />
                <label className="custom-control-label" htmlFor="login-switch">        
                </label>
            </div>
            <span className={displayLogin? "login-label mr-2 active": "login-label mr-2"}  onClick={()=>setDisplayLogin(true)}>Login</span>
        </div>
        {displayLogin? <LoginForm/> : <RegisterForm/>}
    </div>
        
    <div className="m-ghost-card">
        <h3 className="text-center mb-4">Don't want an account?</h3>
        <GuestForm/>  
    </div>
    </div>
</div>
    )
}
