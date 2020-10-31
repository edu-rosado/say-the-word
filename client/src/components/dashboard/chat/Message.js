import React from 'react'

export default function Message({author, text, date, authorIsSelf}) {

    return (
<div className={"msg-block" + (authorIsSelf? " self" : "")}>
    <div className="msg-author">{authorIsSelf? "" : author}</div>
    <div className="msg-text">{text}</div>
    <div className="msg-time">{date}</div>
</div>
    )
}
