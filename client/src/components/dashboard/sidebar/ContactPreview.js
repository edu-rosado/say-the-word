import React, { useState } from 'react'
import { useEffect } from 'react'

export default function ContactPreview({name, selectedItems}) {
    
    const [isClicked, setisClicked] = useState(false)
    useEffect(() => {
        if (selectedItems.includes(name)){
            setisClicked(true)
        } else{
            setisClicked(false)
        }
    }, [selectedItems])
    
    return (
        <div 
        data-name={name} 
        data-active={isClicked} // porque el valor se actualiza despues de devolverlo
        className={
            "sidebar-item-preview " + (isClicked? "active" : "")
        }
        >
            <h3>{name}</h3>
        </div>
    )
}
