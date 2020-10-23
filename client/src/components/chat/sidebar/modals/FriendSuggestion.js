import React from 'react'
import { useState } from 'react'
import { useEffect } from 'react'

export default function FriendSuggestion() {

    const [suggestionListClass, setSuggestionListClass] = useState("")
    const [usernameSearchClass, setUsernameSearchClass] = useState("")

    useEffect(()=>{
        if (searchActivated){
            setSuggestionListClass("username-suggestion-list")
        } else{
            setSuggestionListClass("username-suggestion-list deactivated")
        }
    })

    return (
        <>

        </>
    )
}
