import React, { useState } from 'react'

export default function ContactPreview({name}) {
    const [isClicked, setIsClicked] = useState(false)
    return (
        <div 
        data-name={name} 
        data-active={!isClicked} // porque el valor se actualiza despues de devolverlo
        onClick={()=>setIsClicked(!isClicked)}
        className={isClicked ? "sidebar-item-preview active" : "sidebar-item-preview"}
        >
            <h3>{name}</h3>
        </div>
    )
}
