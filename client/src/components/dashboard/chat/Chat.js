import React from 'react'
import { useSelector } from 'react-redux'
import ActiveChat from './ActiveChat'
import InactiveChat from './InactiveChat'


export default function Chat() {

    const activeMineId = useSelector(state => state.games.activeMineId)

    return (
<div className="m-chat">
    {
        activeMineId === -1 ? 
            <InactiveChat/>
        :   <ActiveChat/>
    }
</div>
    )
}
