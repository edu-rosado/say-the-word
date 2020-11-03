import {combineReducers} from 'redux'
import contactsReducer from './contactsReducer'
import gamesReducer from './gamesReducer'
import socketReducer from './socketReducer'
import userReducer from './userReducer'

export default combineReducers({
    user: userReducer,
    socket: socketReducer,
    contacts: contactsReducer,
    games: gamesReducer,
})