import React from 'react'
import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { getFriends } from '../../../../actions/ContactsFriendsActions'
import ContactPreview from '../ContactPreview'

export default function GameContactSelection({
    participants, setParticipants
}) {

    const dispatch = useDispatch()
    const token = useSelector(state => state.user.token)
    const friends = useSelector(state => state.user.friends)

    useEffect(()=>{
        dispatch(getFriends(token))
    },[])

    function displayFriends(){
        if (friends.length === 0){
            return <p className="text-muted pt-3 px-3 border-top">You still haven't added any friends</p>
        }else{
            return (friends.map(friendName => (
                <ContactPreview
                    key={friendName}
                    name={friendName}
                    selectedItems={participants}
                />
            )))
        }
    }

    function handleParticipantClick(e){
        const username = e.target.getAttribute("data-name")
        if(participants.includes(username)){
            setParticipants(prev=> 
                prev.filter(element => 
                    element !== username))
        } else{
            setParticipants(prev=> [...prev, username]) 
        }
    }
    
    return (
        <div className="new-game-contacts">
            <div className="game-participant-container">
                <div className="game-participant-choice-list" onClick={handleParticipantClick}>
                    {displayFriends()}
                </div>
            </div>
        </div>
    )
}