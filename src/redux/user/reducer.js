let initialState = {
    name: "user_1", id: 1, amount: 999.756 
}

export default function (state = initialState, action) {
    switch (action.type) {
        case "CHANGE_AMOUNT":
            return { ...state, amount: state.amount + action.payload }
        default:
            return state
    }
}