import React from 'react'
import {useSelector } from 'react-redux'
import { Redirect, Route } from 'react-router-dom'

export default function PrivateRoute({component: Component, ...parentProps}) {

    const token = useSelector(state => state.user.token)
    
    return (
        <Route {...parentProps} render={ props =>(
            token !== null ? <Component {...props}/>
            : <Redirect to="/"/>
        )}/>       
    )
}
