import React from 'react'
import { useEffect } from 'react'
import { useState } from 'react'

export default function Message({
    author, text, date, authorIsSelf, isImpostor, impostorFriend
}) {

    const [msgClass, setMsgClass] = useState("msg-block")
    const [authorStr, setAuthorStr] = useState(author)

    useEffect(() => {
        let extraClasses = ""
        if (author.length == 0){
            extraClasses += " bot"
        } else if (isImpostor){
            if (authorIsSelf){
                extraClasses += " self impostor-friend"
                setAuthorStr(`'${impostorFriend}' acting as yourself`)
            } else if (author === impostorFriend){
                extraClasses += " impostor"
                setAuthorStr(`You acting as '${impostorFriend}'`)
            }
        } else if (authorIsSelf){
            extraClasses += " self"
        }
        setMsgClass("msg-block" + extraClasses)
    }, [])

    return (
<div className={msgClass}>
    <div className="msg-author">{authorStr}</div>
    <div className="msg-text">{text}</div>
    <div className="msg-time">{date}</div>
</div>
    )
}
