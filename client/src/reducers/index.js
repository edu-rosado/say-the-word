import {combineReducers} from 'redux'
import contactsReducer from './contactsReducer'
import friendsReducer from './friendsReducer'
import socketReducer from './socketReducer'
import userReducer from './userReducer'
export default combineReducers({
    user: userReducer,
    socket: socketReducer,
    contacts: contactsReducer,
    friends: friendsReducer,
})