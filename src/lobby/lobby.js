import { Button } from '@material-ui/core'
import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { useSpring, animated, config } from 'react-spring'
import styles from "./lobby.module.css"
import Card from "./roomCard/card"
import Dialog from "./registerDialog/dialog"

export default function Lobby() {
    const room = useSelector(s => s.room)
    const { rooms, selectedRoom } = room
    // const selectedRoom = useSelector(s => s.room.selectedRoom)
    const user = useSelector(s=>s.user)
    return (
        <div className={styles.container} >
            <div className={styles.userInfo}>
                <div className={styles.imgCont} >
                    <img src="public/default-avatar.png" alt="avatar" className={styles.img} />
                </div>
                <div className={styles.infoCont} >
                    <div className={`${styles.Bbottom} ${styles.text}`}>
                        {user.name}
                    </div>

                    <div className={styles.text}>
                        {user.amount}
                    </div>
                </div>
            </div>
            <div className={styles.roomsContainer} >
                {rooms && rooms.map((room) => (
                    <Card
                        key={room.id}
                        id={room.id}
                        maxPlayers={room.maxPlayers}
                        currentRegistereds={room.currentRegistereds}
                        roomName={room.roomName}
                        buyIn={room.buyIn}
                    />
                ))}
            </div>
            <div className={styles.tableContainer} >
                {selectedRoom && selectedRoom.currentRegistereds && <Table selectedRoom={selectedRoom} />
                }

            </div>
        </div>
    )
}


function Table({ selectedRoom }) {

    const [props, setter] = useSpring(() => ({ width: "0px", height: "0px", opacity: 0, config: { mass: 1, tension: 500, friction: 30 } }))
    const [openRegisterDialog, setOpenRegisterDialog] = useState(false)

    useEffect(() => {
        setTimeout(() => {
            setter({ width: "800px", height: "470px", opacity: 1 })
        }, 100)
        setter({ width: "0px", height: "0px", opacity: 0 })
    }, [selectedRoom])

    function getPosition(i, max) {
        if (i === "currentUser") {
            return { bottom: "90px", left: "50%" }
        }
        if (max > 2) {
            switch (i) {
                case 0:
                    return { top: "90px", left: "50%" }
                case 1:
                    return { top: "50%", left: "90px" }
                case 2:
                    return { bottom: "90px", left: "50%" }
                case 3:
                    return { top: "50%", right: "90px" }
                default:
                    break;
            }
        } else {
            switch (i) {
                case 0:
                    return { top: "90px", left: "50%" }
                case 1:
                    return { bottom: "90px", left: "50%" }
                default:
                    break;
            }
        }
    }

    console.log('selectedRoom', selectedRoom)
    return <>
        <Dialog 
            open={openRegisterDialog}
            setOpen={setOpenRegisterDialog}
        />
        <animated.div style={props} className={styles.table} >
            <img src="public/OkeyTabe.png" alt="table" className={styles.tableImg} />
            {selectedRoom.currentRegistereds && selectedRoom.currentRegistereds.map((user, i) => {
                return <div className={styles.userNameField} style={getPosition(i, selectedRoom.maxPlayers)}>{user}</div>
            })}
            {selectedRoom && selectedRoom.currentRegistereds && selectedRoom.maxPlayers > selectedRoom.currentRegistereds.length &&
                <div className={styles.userNameField} style={getPosition("currentUser")}>EMPTY SEAT</div>}
        </animated.div>
        {selectedRoom && selectedRoom.currentRegistereds && selectedRoom.maxPlayers > selectedRoom.currentRegistereds.length && <Button
            onClick={() => setOpenRegisterDialog(true)}
            variant="contained"
            style={{ backgroundColor: "green", color: "#FFF", fontSize: "20px" }}
        >
            Registering
        </Button>}
    </>
}
