export const GET_DOMINOES = () => {
    return {
        type: "GET_DOMINOES",
    }
}


export const ENTER_GAME = (payload) => {
    return {
        type: "ENTER_GAME",
        payload,
    }
}

export const SELECT_DOMINO = (payload) => {
    return {
        type: "SELECT_DOMINO",
        payload,
    }
}

export const UNSELECT_DOMINO = () => {
    return {
        type: "UNSELECT_DOMINO",
    }
}

export const DROP_LOCATION = (i) => {
    return {
        type: "DROP_LOCATION",
        payload: i,
    }
}
export const DROP = (fromIndex, toIndex) => {
    return {
        type: "DROP",
        payload: {fromIndex, toIndex},
    }
}

