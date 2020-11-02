import React from 'react'

export default function InactiveChat() {
    return (
        <div className="inactive-chat-container">
            <div className="main-message">
                <div className="faces">
                    <i class="far fa-meh"></i>
                    <i class="fas fa-meh"></i>
                    <i class="far fa-meh"></i>
                    <i class="fas fa-meh"></i>
                </div>
                <h3>You have not joined any games yet</h3>
                <div className="faces">
                    <i class="fas fa-meh"></i>
                    <i class="far fa-meh"></i>
                    <i class="fas fa-meh"></i>
                    <i class="far fa-meh"></i>
                </div>
            </div>
            <div className="get-started">
                <h3>Get started:</h3>
                <div className="option">
                    <i class="fas fa-angle-double-left"></i>
                    <p>Create a new game</p>
                </div>
                <div className="option">
                    <i class="fas fa-angle-double-left"></i>
                    <p>Join a public game in "All Games"</p>
                </div>
                <div className="option">
                    <i class="fas fa-angle-double-left"></i>
                    <p>Join a game by id (NOT IMPLEMENTED YET)</p>
                </div>
            </div>
        </div>
    )
}
