import { getInitialBank } from "../../helpers/functions";
import styles from "../../game/game.module.css"

let initialState = {
        oponent: {
            // name: state.selectedRoom[0],
            name: "user_5",
            score: 0,
            dominos: new Array(26).fill(null)
        },
        user:{
            // name: state.user.name,
            name: "user_1",
            score: 0,
            dominos: new Array(26).fill(null)
        },
        bank: getInitialBank(),
        selectedDomino: null,
        dropLocation:null,
        banksOpenedDomino: null,
        specialLocations: ["userSide", "banksOpenedDomino"]
}


export default function (state=initialState, action) {
    switch (action.type) {
        case "GET_DOMINOES":
            const { bank, user, oponent } = state
            ///user dominos////////
            let randoms = []
            while(randoms.length < 14){
                let index = Math.floor(Math.random() * (bank.length - 1));
                randoms.indexOf(index) === -1 && randoms.push(index);
            }
            randoms.forEach((item, i)=>{
                let k = i+3 < 10 ? i+3 : i+9
                user.dominos.splice(k, 1, {...bank[item], i: k})
            })
            randoms.forEach(item=>{
                bank.splice(item, 1);
            })
            /////////////////////
            ///oponent dominos///
            randoms = []
            while(randoms.length < 14){
                let index = Math.floor(Math.random() * (bank.length - 1));
                randoms.indexOf(index) === -1 && randoms.push(index);
            }
            randoms.forEach((item, i)=>{
                let k = i+3 < 10 ? i+3 : i+9
                oponent.dominos.splice(k, 1, bank[item])
            })
            randoms.forEach(item=>{
                bank.splice(item, 1);
            })
            /////////////////////
            ////////random domino from bank//////////

            let ind = Math.floor(Math.random() * (bank.length - 1))
            let banksOpenedDomino = bank[ind]
            bank.splice(ind, 1)



            ////////////////////////////////////////
            return {
                ...state,
                user: {
                    ...state.user,
                    dominos: user.dominos,
                },
                oponent:{
                    ...state.oponent,
                    dominos: oponent.dominos
                },
                banksOpenedDomino: banksOpenedDomino
            }
        case "ENTER_GAME":
            return {
                ...state,
                oponent: {
                    name: action.payload.room.currentRegistereds[0],
                    score: 0,
                    dominos: new Array(26).fill(null)
                },
                user:{
                    name: action.payload.user.name,
                    score: 0,
                    dominos: new Array(26).fill(null)
                },
                banksOpenedDomino: null
            }
        case "SELECT_DOMINO":
            return {
                ...state,
                selectedDomino: action.payload,
            }
        case "UNSELECT_DOMINO":
            state.selectedDomino.ref = styles.domino
            return{
                ...state,
                selectedDomino: null,
            }
        case "DROP_LOCATION":
            // console.log(`action.payload`, action.payload)
            return {
                ...state,
                dropLocation: action.payload,
            }
        case "DROP":
            const { dominos } = state.user
            const { fromIndex, toIndex, type } = action.payload
            // console.log(`action.payload`, action.payload)
            if(state.specialLocations.includes(toIndex)){
                dominos[fromIndex] = null
            }else{
                if(state.specialLocations.includes(type)){
                    dominos[toIndex] = state.selectedDomino.item;
                    dominos[toIndex].i = toIndex 
                    dominos[toIndex].type = undefined
                }else{
                    dominos[fromIndex].i = toIndex;
                    [dominos[fromIndex], dominos[toIndex]] = [dominos[toIndex], dominos[fromIndex]]
                }
            }
            // console.log(`dominos`, dominos)
            // console.log(`getSubArrays(dominos)`, subset(dominos, 3))
            return{
                ...state,
                user: {
                    ...state.user,
                    dominos: dominos,
                }
            }
            case "OPEN_BANK_DOMINO":
                ind = Math.floor(Math.random() * (state.bank.length - 1))
                banksOpenedDomino = state.bank[ind]
                bank.splice(ind, 1)
                return{
                    ...state,
                    banksOpenedDomino: banksOpenedDomino
                }
        default:
            return state
    }
}