import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { setMineActiveId } from '../../../actions/gameActions'
import ActiveChat from './activeChat/ActiveChat'
import InactiveChat from './InactiveChat'


export default function Chat() {

    const activeMineId = useSelector(state => state.games.activeMineId)
    const myGames = useSelector(state => state.games.myGames)
    const dispatch = useDispatch()

    // If no game active, but myGames is not empty, activate first game
    useEffect(() => {
        if (activeMineId === -1 && (myGames.length > 0)){
            dispatch(setMineActiveId(myGames[0]._id))
        }
    }, [activeMineId, myGames])

    return (
<>
    {
        activeMineId === -1 ? 
            <InactiveChat/>
        :   <ActiveChat/>
    }
</>
    )
}
