import React, { useState } from 'react'
import {Button, Form} from 'react-bootstrap'
import { Link } from 'react-router-dom'
import {useDispatch} from 'react-redux'
import {registerUser} from '../../actions/userActions'

export default function RegisterForm() {

    const dispatch = useDispatch();

    const [username,setUsername] = useState("")
    const [email,setEmail] = useState("")
    const [password,setPassword] = useState("")
    const [password2,setPassword2] = useState("")
    const [affectedField,setAffectedField] = useState("")
    const [errorMsg,setErrorMsg] = useState("")


    const handleSubmit = async (e) =>{
        e.preventDefault();

        if (password !== password2){
            setAffectedField("password2")
            setErrorMsg("The repeated password does not match")
            return // nothing else to do
        }
        const errorObj = await dispatch(registerUser({
            username,email,password 
        }))
        if (errorObj){
            setAffectedField(errorObj.affectedField)
            setErrorMsg(errorObj.errorMsg)
        }
    }

    return (
        <>
        <Form onSubmit={handleSubmit} >
            <Form.Control type="submit" style={{display:"none"}} /> {/* For submiting with enter */}
            <Form.Group controlId="name">
                <Form.Label>Name</Form.Label>
                <Form.Control type="text" value={username} onChange={e=>setUsername(e.target.value)} />
                {affectedField === "username" ?
                    (<span className="text-danger"> {errorMsg} </span>)
                : ""}
            </Form.Group>
            <Form.Group controlId="email">
                <Form.Label>Email</Form.Label>
                <Form.Control type="email" value={email} onChange={e=>setEmail(e.target.value)} />
                {affectedField === "email" ?
                    (<span className="text-danger"> {errorMsg} </span>)
                : ""}                
            </Form.Group>            
            <Form.Group controlId="password">
                <Form.Label>Password</Form.Label>
                <Form.Control type="password" value={password} onChange={e=>setPassword(e.target.value)} />
                {affectedField === "password" ?
                    (<span className="text-danger"> {errorMsg} </span>)
                : ""}                
            </Form.Group>
            <Form.Group controlId="password2">
                <Form.Label>Repeat password</Form.Label>
                <Form.Control type="password" value={password2} onChange={e=>setPassword2(e.target.value)}  />
                {affectedField === "password2" ?
                    (<span className="text-danger"> {errorMsg} </span>)
                : ""}                  
            </Form.Group>            
            <Link to="/chat"><Button onClick={handleSubmit} className="w-100">Register</Button></Link>
        </Form>
        </>
    )
}
