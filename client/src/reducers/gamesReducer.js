import { CREATE_GAME, GET_MY_GAMES, GET_NOT_MY_GAMES, JOIN_GAME, LEAVE_GAME, RESET_ACTIVE_ID, RESET_MINE_ACTIVE_ID, SET_ACTIVE_ID, SET_MINE_ACTIVE_ID, SET_NOT_MINE_ACTIVE_ID, STORE_MESSAGE } from "../actions/types";
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
            const {_id, username} = action.payload
            const game2join = state.notMyGames.find(game => game._id === _id)
            game2join.participants.push(username)
            return{
                ...state,
                myGames: [...state.myGames, game2join],
                notMyGames: state.notMyGames.filter(
                    game => game._id !== _id
                ),
                activeMineId: state.myGames[-1]._id,
            }
        }
        case LEAVE_GAME:{
            const {_id, username} = action.payload
            const game2leave = state.myGames.find(game => game._id === _id)
            game2leave.participants.pop(username)
            return{
                ...state,
                notMyGames: [...state.notMyGames, game2leave],
                myGames: state.myGames.filter(
                    game => game._id !== _id
                ),
                activeMineId: state.myGames[-2],
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
        default:
            return state
    }
}