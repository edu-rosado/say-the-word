import React from 'react'

export default function Message({author, text}) {

    return (
<div className={"msg-block" + (author === "" ? " self" : "")}>
    <div className="msg-author">{author}</div>
    <div className="msg-text">{text}</div>
    <div className="msg-time">14:30</div>
</div>
    )
}
