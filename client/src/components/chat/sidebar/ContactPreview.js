import React from 'react'

export default function ContactPreview({name, statusMessage}) {
    return (
        <div className="sidebar-item-preview">
            <h3>{name}</h3>
            <p className="text-muted">{statusMessage}</p>
        </div>
    )
}
