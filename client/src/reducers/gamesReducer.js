import { ADD_PARTICIPANT, CREATE_GAME, GAIN_POINT, GET_MY_GAMES, GET_NOT_MY_GAMES, JOIN_GAME, LEAVE_GAME, LOGOUT_GAMES, RESET_ACTIVE_ID, RESET_MINE_ACTIVE_ID, SET_ACTIVE_ID, SET_MINE_ACTIVE_ID, SET_NOT_MINE_ACTIVE_ID, STORE_MESSAGE } from "../actions/types";
const initialState = {
    myGames:[],
    notMyGames:[],
    activeMineId: -1,
    activeNotMineId: -1,
}
export default function(state=initialState, action=null){
    switch(action.type){
        case CREATE_GAME:
            return {
                ...state, 
                myGames: [...state.myGames, action.payload]
            }
        case GET_MY_GAMES:
            return {
                ...state,
                myGames: action.payload
            }
        case GET_NOT_MY_GAMES:
            return {
                ...state,
                notMyGames: action.payload
            }
        case JOIN_GAME:{
            const {game} = action.payload
            return{
                ...state,
                myGames: [...state.myGames, game],
                notMyGames: state.notMyGames.filter(
                    notMyGame => notMyGame._id !== game._id
                ),
                activeMineId: game._id,
            }
        }
        case LEAVE_GAME:{
            const {game, username} = action.payload
            const game2leave = state.myGames.find(g => g._id === game._id)
            game2leave.participants.pop(username)
            delete game2leave.points[username]
            game2leave.targetWord = null
            game2leave.messages = []
            return{
                ...state,
                notMyGames: [...state.notMyGames, game2leave],
                myGames: state.myGames.filter(
                    g => g._id !== game._id
                ),
                activeMineId: -1,
            }
        }
        case ADD_PARTICIPANT:{
            const {username, gameId} = action.payload
            return {
                ...state, 
                myGames: state.myGames.map(game =>{
                    if (game._id == gameId){
                        game.participants.push(username)
                        game.points[username] = 0
                    }
                    return game
                })
            }
        }
        case RESET_MINE_ACTIVE_ID:
            return {
                ...state,
                activeMineId: -1
            }                  
        case SET_MINE_ACTIVE_ID:
            return {
                ...state,
                activeMineId: state.myGames.find(
                    game => game._id === action.payload
                )._id
            }
        case SET_NOT_MINE_ACTIVE_ID:
            return {
                ...state,
                activeNotMineId: state.notMyGames.find(
                    game => game._id === action.payload
                )._id
            }                                    
        case STORE_MESSAGE:
            const {gameId, msg} = action.payload
            return {
                ...state, 
                myGames: state.myGames.map(game =>{
                    if (game._id == gameId){
                        game.messages.push(msg)
                    }
                    return game
                })
            }
        case GAIN_POINT:{
            const {gameId, username} = action.payload
            return {
                ...state, 
                myGames: state.myGames.map(game =>{
                    if (game._id == gameId){
                        game.points[username] += 1
                    }
                    return game
                })
            }
        }
        case LOGOUT_GAMES:
            return initialState
        default:
            return state
    }
}