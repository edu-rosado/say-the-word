import { CREATE_GAME, GET_MY_GAMES, GET_NOT_MY_GAMES, JOIN_GAME, LEAVE_GAME } from "../actions/types";

export default function(state={myGames:[],notMyGames:[]}, action=null){
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
                myGames: [...state.myGames, game2join],
                notMyGames: state.notMyGames.filter(
                    game => game._id !== _id
                ),
            }
        }
        case LEAVE_GAME:{
            const {_id, username} = action.payload
            const game2leave = state.myGames.find(game => game._id === _id)
            game2leave.participants.pop(username)
            return{
                notMyGames: [...state.notMyGames, game2leave],
                myGames: state.myGames.filter(
                    game => game._id !== _id
                ),
            }
        }
        default:
            return state
    }
}


// import { CREATE_GAME, GET_GAMES, JOIN_GAME, LEAVE_GAME } from "../actions/types";

// export default function(state=[], action=null){
//     switch(action.type){
//         case CREATE_GAME:
//             return [...state, action.payload]
//         case GET_GAMES:
//             return action.payload
//         case JOIN_GAME:{
//             const {_id, username} = action.payload
//             state.find(game => game._id === _id)
//                 .participants.push(username)
//             return state}
//         case LEAVE_GAME:{
//             const {_id, username} = action.payload
//             state.find(game => game._id === _id)
//                 .participants.pop(username)
//             return state}
//         default:
//             return state
//     }
// }