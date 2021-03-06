import { getInitialBank } from "../../helpers/functions";
import styles from "../../game/game.module.css";

let initialState = {
  oponent: {
    // name: state.selectedRoom[0],
    name: "user_5",
    score: 0,
    dominos: new Array(26).fill(null),
  },
  user: {
    // name: state.user.name,
    name: "user_1",
    score: 0,
    dominos: new Array(26).fill(null),
  },
  bank: getInitialBank(),
  selectedDomino: null,
  dropLocation: null,
  banksOpenedDomino: null,
  usersDomino: null,
  oponentsDomino: null,
  specialLocations: [
    { name: "userSide", left: `89%`, top: "39%" },
    { name: "banksOpenedDomino", top: "20%", left: "52%" },
  ],
};

export default function (state = initialState, action) {
  let { bank, banksOpenedDomino, usersDomino } = state;
  let { user, oponent } = state;
  let { dominos } = state.user;
  switch (action.type) {
    case "GET_DOMINOES":
      ///user dominos////////
      let randoms = [];
      do {
        let index = Math.floor(Math.random() * bank.length);
        randoms.indexOf(index) === -1 && randoms.push(index);
      } while (randoms.length < 28);

      console.log(`randoms`, randoms);
      randoms.forEach((item, i) => {
        let k = i + 3 < 10 ? i + 3 : i + 9;
        if (i < 14) {
          user.dominos.splice(k, 1, { ...bank[item], i: k });
        } else {
          oponent.dominos.splice(k, 1, { ...bank[item], i: k });
        }
      });
      bank = bank.filter((_, i) => !randoms.includes(i));

      // ////////random domino from bank//////////

      let ind = Math.floor(Math.random() * bank.length);
      banksOpenedDomino = bank[ind];
      bank.splice(ind, 1);

      ////////////////////////////////////////
      return {
        ...state,
        user: {
          ...state.user,
          dominos: user.dominos,
        },
        oponent: {
          ...state.oponent,
          dominos: oponent.dominos,
        },
        bank,
        banksOpenedDomino: banksOpenedDomino,
      };
    case "SELECT_DOMINO":
      return {
        ...state,
        selectedDomino: action.payload,
      };
    case "UNSELECT_DOMINO":
      // state.selectedDomino.ref = styles.domino
      return {
        ...state,
        selectedDomino: null,
      };
    case "DROP_LOCATION":
      // console.log(`action.payload`, action.payload)
      return {
        ...state,
        dropLocation: action.payload,
      };
    case "DROP":
      const { fromIndex, toIndex, domino, indexSpecial } = action.payload;
      // console.log(`action.payload`, action.payload)
      if (
        fromIndex === toIndex ||
        (typeof fromIndex !== "number" && typeof toIndex !== "number")
      ) {
        return { ...state };
      } else if (indexSpecial) {
        switch (indexSpecial.name) {
          case "banksOpenedDomino":
            dominos[toIndex] = state.banksOpenedDomino;
            let ind = Math.floor(Math.random() * (bank.length - 1));
            banksOpenedDomino = bank[ind];
            bank.splice(ind, 1);

            break;
          case "usersSide":
              if(fromIndex==="usersSide"){
                dominos[toIndex] = state.usersDomino;
              }else{
                usersDomino = dominos[fromIndex]
                dominos[fromIndex] = null
              }

            break;

          default:
            break;
        }
      } else if (typeof fromIndex === "number" && typeof toIndex === "number") {
        dominos[fromIndex].i = toIndex;
        [dominos[fromIndex], dominos[toIndex]] = [dominos[toIndex], dominos[fromIndex]];
      }
      // if(state.specialLocations.includes(toIndex)){
      //     dominos[fromIndex] = null
      // }else{
      //     if(state.specialLocations.includes(type)){
      //         dominos[toIndex] = state.selectedDomino.item;
      //         dominos[toIndex].i = toIndex
      //         dominos[toIndex].type = undefined
      //     }else{

      //     }
      // }
      // console.log(`dominos`, dominos)
      // console.log(`getSubArrays(dominos)`, subset(dominos, 3))
      return {
        ...state,
        user: {
          ...state.user,
          dominos: dominos,
        },
        bank,
        banksOpenedDomino,
        usersDomino,
      };

    default:
      return state;
  }
}
