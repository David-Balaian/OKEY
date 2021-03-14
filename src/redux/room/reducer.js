let initialState = {
    selectedRoom: {},
    rooms: [
        { roomName: "test_1", maxPlayers: 2, currentRegistereds: ["user_2"], buyIn: 200, id: Math.random() },
        { roomName: "test_2", maxPlayers: 2, currentRegistereds: ["user_3"], buyIn: 100, id: Math.random() },
        { roomName: "test_3", maxPlayers: 2, currentRegistereds: ["user_5", "user_4"], buyIn: 150, id: Math.random() },
        { roomName: "test_4", maxPlayers: 2, currentRegistereds: ["user_6"], buyIn: 40, id: Math.random() },
        { roomName: "test_5", maxPlayers: 2, currentRegistereds: ["user_7", "user_12"], buyIn: 250, id: Math.random() },
        { roomName: "test_6", maxPlayers: 2, currentRegistereds: ["user_8"], buyIn: 200, id: Math.random() },
        { roomName: "test_7", maxPlayers: 2, currentRegistereds: ["user_9"], buyIn: 30, id: Math.random() },
        { roomName: "test_8", maxPlayers: 2, currentRegistereds: ["user_10", "user_11"], buyIn: 200, id: Math.random() },
    ],
}

export default function (state = initialState, action) {
    switch (action.type) {
        case "SELECT_ROOM":
            return { ...state, selectedRoom: action.payload }
        default:
            return state
    }
}