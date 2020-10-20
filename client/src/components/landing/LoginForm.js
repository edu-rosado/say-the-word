import React, {useState} from 'react'
import {Button, Form} from 'react-bootstrap'
import { Link } from 'react-router-dom'
import {useDispatch} from 'react-redux'
import {loginUser} from '../../actions/userActions'

export default function LoginForm() {

    const dispatch = useDispatch();

    const [email,setEmail] = useState("")
    const [password,setPassword] = useState("")
    const [affectedField,setAffectedField] = useState("")
    const [errorMsg,setErrorMsg] = useState("")


    const handleSubmit = async (e) =>{
        e.preventDefault();

        const errorObj = await dispatch(loginUser({
            email,password 
        }))
        if (errorObj){
            setAffectedField(errorObj.affectedField)
            setErrorMsg(errorObj.errorMsg)
        } else{
            // redirect
        }
    }    
    return (
        <>
        <Form onSubmit={handleSubmit}>
            <Form.Control type="submit" style={{display:"none"}} /> {/* For submiting with enter */}
            <Form.Group controlId="email">
                <Form.Label>Email</Form.Label>
                <Form.Control type="text" value={email} onChange={(e)=>setEmail(e.target.value)}/>
                {affectedField === "email" ?
                    (<span className="text-danger"> {errorMsg} </span>)
                : ""}
            </Form.Group>
            <Form.Group controlId="password">
                <Form.Label>Password</Form.Label>
                <Form.Control type="password" value={password} onChange={(e)=>setPassword(e.target.value)} />
                {affectedField === "password" ?
                    (<span className="text-danger"> {errorMsg} </span>)
                : ""}
            </Form.Group>
            <Link to="/chat"><Button onClick={handleSubmit} className="w-100">Login</Button></Link>
        </Form>
        </>
    )
}
