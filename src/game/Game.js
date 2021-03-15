import React, { useCallback, useEffect, useRef, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { usePrevious } from '../helpers/functions'
import { DROP, DROP_LOCATION, GET_DOMINOES, SELECT_DOMINO, UNSELECT_DOMINO } from '../redux/game/actions'
import styles from "./game.module.css"
import {useSpring, animated} from "react-spring"

export default function Game() {
    const dispatch = useDispatch()
    const game = useSelector(s => s.game)
    const { oponent, user } = game
    const [oponentsDomino, setOponentsDomino] = useState(null)
    const [userssDomino, setUserssDomino] = useState(null)
    const selectedDomino = useSelector(s => s.game.selectedDomino)
    const dropLocation = useSelector(s=>s.game.dropLocation)
    const dominosContainerRef = useRef()
    const gameTableRef = useRef()
    useEffect(() => {
        dispatch(GET_DOMINOES())
    }, [])

    useEffect(() => {
        if(selectedDomino){
            // console.log(`selectedDomino`, selectedDomino.ref)
            selectedDomino.ref.current.className = styles.selectedDomino
            let index = selectedDomino.i > 13 ? selectedDomino.i - 13 : selectedDomino.i;

            selectedDomino.styleSetter(
                {
                    boxShadow: "0px 0px 10px 10px rgb(0 0 0 / 50%)",
                    transform: "scale(1.1)",
                    top:`${selectedDomino.i > 13 ? parseInt(selectedDomino.ref.current.clientHeight) : 0}px`,
                    left:`${index * parseInt(selectedDomino.ref.current.clientWidth)}px`,
            })
        }
    }, [selectedDomino])

    function handleMouseUp() {
        if(selectedDomino){
            selectedDomino.ref.current.className = styles.domino;
            selectedDomino.styleSetter(
                {
                    boxShadow: "0px 0px 0px 0px rgb(0 0 0 / 0%)",
                    transform: "scale(1)",
            }) 
        console.log(`selectedDomino`, selectedDomino.type)
            
            if(typeof(dropLocation) === "number"){
                dispatch(DROP(selectedDomino.i, dropLocation, selectedDomino.type))
                selectedDomino.ref.current.style.top = dropLocation >= 13 ? "50%" : "0px";
                selectedDomino.ref.current.style.left = `calc((100% / 13) * ${dropLocation >= 13 ? dropLocation - 13 : dropLocation})`
            }else if(dropLocation==="userSide"){
                setUserssDomino(selectedDomino.item)
                dispatch(DROP(selectedDomino.i, dropLocation, selectedDomino.type))
                // selectedDomino.ref.current.style.display = "none"
                // selectedDomino.ref.current.style.right = "20px"
            }else{
                selectedDomino.ref.current.style.top = selectedDomino.i >= 13 ? "50%" : "0px";
                selectedDomino.ref.current.style.left = `calc((100% / 13) * ${selectedDomino.i >= 13 ? selectedDomino.i - 13 : selectedDomino.i})`
            }
            dispatch(DROP_LOCATION(null))
            dispatch(UNSELECT_DOMINO())
            if(selectedDomino.type === "userSide"){
                setUserssDomino(null)
            }
        }
    }
    function handleDrag(e){
        if(!selectedDomino) return
        // let rectDomino = selectedDomino.ref.current.getBoundingClientRect()
        let rect = dominosContainerRef.current.getBoundingClientRect()
        if(selectedDomino.type==="userSide"){
            rect = gameTableRef.current.getBoundingClientRect()
            
        }
        selectedDomino.styleSetter(
            {
                top: `${e.clientY - rect.top - (selectedDomino.ref.current.clientHeight/2)}px`,
                left: `${e.clientX  - rect.left - (selectedDomino.ref.current.clientWidth/2)}px`,
        }) 
        // let cont = selectedDomino.ref.current.closest(`.area > .dropable`)
        // console.log(`cont`, cont)
        selectedDomino.ref.current.style.top = `${e.clientY - rect.top - selectedDomino.ref.current.clientHeight/2}px`; 
        selectedDomino.ref.current.style.left = `${e.clientX  - rect.left - selectedDomino.ref.current.clientWidth/2}px`;
        selectedDomino.ref.current.style.zIndex = 1000;
    }

    return (
        <div className={styles.container} onMouseUp={handleMouseUp} onMouseMove={handleDrag} >
            <div className={styles.gameTable} ref={gameTableRef} >
                <div className={styles.nameCont} style={{ top: "0px" }} ><span className={styles.userName} > {oponent.name} </span> <span className={styles.score} > Score: {oponent.score} </span></div>
                <div className={styles.nameCont} style={{ bottom: "41%" }} > <span className={styles.userName} >{user.name} </span> <span className={styles.score} > Score: {user.score} </span></div>
                <div className={styles.dominoContainer} style={{ top: "10px", left: "20px" }} > {oponentsDomino && <Domino item={oponentsDomino} />} </div>
                {userssDomino ? <Domino type="userSide" item={userssDomino} /> : <div className={styles.dominoContainer} style={{zIndex:selectedDomino ? 1001 : "unset", bottom: "41%", right: "20px" }} onMouseOver={()=>{ if(!selectedDomino) return; dispatch(DROP_LOCATION("userSide"))}} onMouseLeave={()=>{if(!selectedDomino) return; dispatch(DROP_LOCATION(null))}}  >  </div>}
                <div className={`area ${styles.dominosContainer}`} ref={dominosContainerRef} >
                    {user.dominos.map((item, i) => {
                        if(item){
                            return <div key={item.id} className={styles.singleDominoContiner}> 
                                <Domino item={item} i={i} />
                            </div>
                        }else{
                            return <div key={i} style={selectedDomino ? {zIndex:1001} : {}} onMouseOver={()=>{ if(!selectedDomino) return; dispatch(DROP_LOCATION(i))}} onMouseLeave={()=>{if(!selectedDomino) return; dispatch(DROP_LOCATION(null))}} className={styles.singleDominoContiner}/>
                        }
                        // return <> {!item ? 
                        //     <Domino key={item} item={item} i={i} />
                        //     : 
                        //     <div id={i} onMouseOver={()=>{ console.log(`i`, i); dispatch(DROP_LOCATION(i))}} onMouseLeave={()=>{if(!selectedDomino) return; dispatch(DROP_LOCATION(null))}} className={`${item ? "" : "dropable"} ${styles.singleDominoContiner}`}/>}</>
                    })}
                </div>
            </div>
        </div>
    )
}

function Domino({ item, i, type }) {
    const dispatch = useDispatch()
    const dominoRef = useRef()
    const [props, setter] = useSpring(()=>({boxShadow: "0px 0px 0px 0px rgb(0 0 0 / 0%)", transform: "scale(1)", config:{mass: 1, tension:500, friction: 10}}))
   

    return (
        <animated.div
            ref={dominoRef}
            style={type==="userSide" ? {...props, position:"absolute", bottom:"41%", right:"20px", height:"20%"} : {...props, position:"absolute", top: i >= 13 ? "50%" : "0px", left:`calc((100% / 13) * ${i >= 13 ? i - 13 : i})`, }}
            className={styles.domino} 
            onMouseDown={() => dispatch(SELECT_DOMINO({ item, i: i ? i : 12, ref:dominoRef, type, styleSetter: setter }))} 
        >
            <div className={styles.Dnumber} style={{ color: item.color }} > {item.value} </div>
            <div className={styles.DStyle}>
                <span className={styles.circle} />
            </div>
        </animated.div>
    )
}
