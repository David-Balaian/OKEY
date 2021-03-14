import { combineReducers } from "redux";
// import reducer from "./reducers/reducer"
import game from "./game/reducer"
import room from "./room/reducer"
import user from "./user/reducer"

export default combineReducers({
    user,
    room,
    game,
})