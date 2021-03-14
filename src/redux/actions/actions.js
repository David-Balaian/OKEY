export const SELECT_ROOM = (id) => {
    return {
        type: "SELECT_ROOM",
        payload: id,
    }
}

export const ENTER_GAME = (room) => {
    return {
        type: "ENTER_GAME",
        payload: room,
    }
}