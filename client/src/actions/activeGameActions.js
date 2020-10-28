const { SET_ACTIVE_GAME } = require("./types")

export const setActiveGame = (game) => {
    return {
        type: SET_ACTIVE_GAME,
        payload: game,
    }
}