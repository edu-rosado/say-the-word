import axios from 'axios';
import React from 'react'
import { useEffect } from 'react';
import { useState } from 'react';
import { Alert, Button, Form, InputGroup, Modal } from "react-bootstrap";
import { useDispatch, useSelector } from 'react-redux';
import { getTokenConfig } from '../../../../actions/aux';
import { addFriend } from '../../../../actions/ContactsFriendsActions';
import ContactPreview from '../ContactPreview';

const BY_USERNAME = "BY_USERNAME"
const BY_EMAIL = "BY_EMAIL"

export default function GamesModal({setModalIsOpen}) {
    const [byUsernameClass, setByUsernameClass] = useState("active")
    const [byEmailClass, setByEmailClass] = useState("")
    const [activeBtn, setActiveBtn] = useState(BY_USERNAME)

    const[inputValue, setInputValue] = useState("")
    const[suggestions, setSuggestions] = useState([])
    const[searchActivated, setSearchActivated] = useState(false)
    const[selectedName, setSelectedName] = useState("")
    const [suggestionListClass, setSuggestionListClass] = useState("")
    const [noResultText, setNoResultText] = useState("")
    const [submitIsActive, setSubmitIsActive] = useState(false)
    const [errorMessage,setErrorMessage] = useState("")
    const [addFriendSuccess, setAddFriendSuccess] = useState(false)

    const token = useSelector(state=> state.user.token)
    const ownName = useSelector(state=> state.user.username)
    const dispatch = useDispatch()

    async function handleSubmit(e){
        const valueToSend = activeBtn == BY_USERNAME? selectedName : inputValue
        e.preventDefault()
        const error = await dispatch(addFriend(token, valueToSend, activeBtn))
        if (error){
            setErrorMessage(error.response.data)
        } else{
            setAddFriendSuccess(true)
            setTimeout(()=>{setModalIsOpen(false)},1000)
        }
    }

    function handleExclusiveBtns(btnKey){
        switch(btnKey){
            case BY_EMAIL:
                setByUsernameClass("")
                setByEmailClass("active")
                setActiveBtn(BY_EMAIL)
                setInputValue("")
                return
            case BY_USERNAME:
            default:
                setByUsernameClass("active")
                setByEmailClass("")
                setActiveBtn(BY_USERNAME)
                setInputValue("")
                return
        }
    }

    async function fetchSuggestions(text){
        setInputValue(text)
        setErrorMessage("")
        if (activeBtn == BY_EMAIL) return
        setSubmitIsActive(false)
        if (text.length > 0){
            const config = getTokenConfig(token)
            axios.get(`/api/contacts/suggestions?text=${text}`,config)
                .then(res =>{
                    setSuggestions(res.data.filter(name => name !== ownName))
                })
            setSearchActivated(true)
        } else{
            setSearchActivated(false)
        }
    }

    function handleSuggestionClick(e){
        if (e.target.tagName === "P") return
        const username = e.target.getAttribute("data-name")
        setInputValue(username)
        setSelectedName(username)
        setSearchActivated(false)
        setSubmitIsActive(true)
        console.log("true")
    }

    useEffect(()=>{
        if (activeBtn === BY_USERNAME){
            setSubmitIsActive(false)
            setNoResultText("No results")
        } else{
            setNoResultText("Suggestions are not available with email search for privacy reasons")
            setSuggestions([])
            setSearchActivated(true)
            setSubmitIsActive(true)
        }
    }, [activeBtn])

    useEffect(()=>{
        let cName = "username-suggestion-list"
        if (!searchActivated){ 
            cName += " deactivated"
        } 
        setSuggestionListClass(cName)
    },[searchActivated])

    return (
        <>
        <Modal.Header>Add a new friend</Modal.Header>
        <Modal.Body className="game">
            <Form onSubmit={handleSubmit}>
                <Form.Group controlId="user-key">
                    <InputGroup>
                        <InputGroup.Prepend>
                            <Button 
                                onClick={()=>handleExclusiveBtns(BY_USERNAME)}
                                variant="info"
                                className={byUsernameClass}
                            >By name</Button>
                            <Button
                                onClick={()=>handleExclusiveBtns(BY_EMAIL)}
                                variant="info"
                                className={byEmailClass}
                            >By email</Button>
                            </InputGroup.Prepend>
                        <Form.Control 
                            type="text"  
                            placeholder="Type to activate suggestions"
                            autocomplete="off"
                            value={inputValue}
                            onChange={(e)=>fetchSuggestions(e.target.value)}
                        />
                    </InputGroup>
                    <div className={suggestionListClass}
                        onClick={handleSuggestionClick}>
                        { suggestions.length > 0?
                            (suggestions.map(name => (
                                <ContactPreview
                                key={name}
                                name={name}
                                activeClass="single"
                                />)
                            ))
                            : <p className="text-muted">{noResultText}</p>}
                    </div>
                </Form.Group>

                <Alert 
                    variant="danger" 
                    className={
                        errorMessage.length > 0? "" :
                        " d-none"
                    }
                >
                    {errorMessage}
                </Alert>

                <Alert 
                    variant="success" 
                    className={
                        addFriendSuccess? "text-center" : "d-none"
                    }
                >
                    Friend added successfully
                </Alert>                

                <Button 
                    type="submit" 
                    onSubmit={handleSubmit}
                    className={submitIsActive? "" : "disabled"}
                    disabled={!submitIsActive}
                >Add friend</Button>
            </Form>
        </Modal.Body>
        </>
)}
