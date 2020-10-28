import {combineReducers} from 'redux'
import activeGameReducer from './activeGameReducer'
import contactsReducer from './contactsReducer'
import friendsReducer from './friendsReducer'
import gamesReducer from './gamesReducer'
import socketReducer from './socketReducer'
import userReducer from './userReducer'

export default combineReducers({
    user: userReducer,
    socket: socketReducer,
    contacts: contactsReducer,
    friends: friendsReducer,
    games: gamesReducer,
    activeGame: activeGameReducer,
})