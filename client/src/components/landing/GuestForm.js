import React, {useState} from 'react'
import {Form, Button} from 'react-bootstrap'
import { useDispatch } from 'react-redux'
import {loginGuestUser} from '../../actions/userActions'

export default function GuestForm() {
    const [guestUsername,setGuestUsername] = useState("Pelícano salvaje")
    const [affectedField,setAffectedField] = useState("")
    const [errorMsg,setErrorMsg] = useState("")

    const dispatch = useDispatch()

    const handleSubmit = async (e) =>{
        e.preventDefault()
        const errorObj = await dispatch(loginGuestUser({
            username: guestUsername
        }))
        if (errorObj){
            setAffectedField(errorObj.affectedField)
            setErrorMsg(errorObj.errorMsg)
        } else{
            setAffectedField("")
            setErrorMsg("")
            setGuestUsername("")
        }
    }

    return (
        <>
        <Form onSubmit={handleSubmit}>
        <Form.Control type="submit" style={{display:"none"}} /> {/* For submiting with enter */}
        <Form.Group controlId="username">
                <Form.Label>Pick a name</Form.Label>
                <Form.Control type="text" value={guestUsername} onChange={(e)=>setGuestUsername(e.target.value)}/>
                {affectedField === "username" ?
                    (<span className="text-danger"> {errorMsg} </span>)
                : ""}                
            </Form.Group>
            <Button className="w-100" onClick={handleSubmit}>Access as a guest</Button>
        </Form>
        <p className="px-2 mt-1" style={{fontSize: "1rem"}}>You won't be able to save contacts or games</p> 
        </>
    )
}
