import React, { useMemo } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { SELECT_ROOM } from '../../redux/room/actions'
import styles from "./card.module.css"

export default function Card({maxPlayers, currentRegistereds, roomName, buyIn, id}) {
    const dispatch = useDispatch()
    const selectedRoom = useSelector(s=>s.room.selectedRoom)
    const borderStyle = useMemo(()=>{
        let arr = ["lightgray", "lightgray", "lightgray", "lightgray"]
        if(!currentRegistereds.length){
            return arr
        }
        let count = currentRegistereds.length*100/maxPlayers===50 ? 2 : 4;

        for(let i=0; i<count; i++){
            arr[i]="green"
        }
        return arr.join(" ")
    },[])

    const selectRoom = (room) => {
        dispatch(SELECT_ROOM(room))
    }

    return (
        <div className={`${styles.container} ${selectedRoom.id===id && styles.selectedContainer} `} onClick={()=>selectRoom({maxPlayers, currentRegistereds, roomName, buyIn, id})} >
            <div className={styles.members} >
                <div className={styles.membersCircle} style={{borderColor: borderStyle}} >
                    <div className={styles.arc}></div>
                    <span className={styles.circleText} style={selectedRoom.id===id ? {color:"#fff"} : {}}  >
                    {`${currentRegistereds.length}/${maxPlayers}`}
                    </span>
                </div>
            </div>
            <div className={styles.info}>
                <div className={styles.userName}>
                    <span className={styles.nl} >NL</span>
                    <span style={selectedRoom.id===id ? {color:"#fff"} : {}} >{roomName}</span>
                </div>
                <div className={styles.pot}>
                    {currentRegistereds.length * buyIn}
                </div>
            </div>
            <div className={styles.buyIn}>
                <div className={styles.buyInCard}>
                    <div className={styles.buyInCardInner} style={selectedRoom.id===id ? {color:"#fff"} : {}} >
                        <div>Buy In</div>
                        <div>{buyIn}</div>
                    </div>
                </div>
            </div>
        </div>
    )
}
