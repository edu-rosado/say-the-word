import React from 'react'
import Sidebar from './sidebar/Sidebar'
import Chat from './Chat'

export default function Dashboard() {
    return (
        <div className="m-dashboard-container">
            <div className="m-dashboard">
                <Sidebar/>
                <Chat/>
            </div>
        </div>
    )
}
