import React, { useCallback, useEffect, useRef, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { subArrs, isSubArray } from '../helpers/functions'
import { DROP, DROP_LOCATION, GET_DOMINOES, OPEN_BANK_DOMINO, SELECT_DOMINO, UNSELECT_DOMINO } from '../redux/game/actions'
import styles from "./game.module.css"
import { useSpring, animated } from "react-spring"

export default function Game() {
    const dispatch = useDispatch()
    const game = useSelector(s => s.game)
    const { oponent, user, bank, banksOpenedDomino } = game
    const [oponentsDomino, setOponentsDomino] = useState(null)
    const userssDomino = useSelector(s=>s.usersDomino)
    const selectedDomino = useSelector(s => s.game.selectedDomino)
    const dropLocation = useRef({from: null, to: null})
    const dominosContainerRef = useRef()
    const gameTableRef = useRef()
    const [combinations, setCombinations] = useState([])
    const specialLocations = useSelector(s=>s.game.specialLocations)
    const openedFromBankRef = useRef()
    const usersDominoRef = useRef()

    useEffect(() => {
        dispatch(GET_DOMINOES())
    }, [])

    useEffect(() => {
        // console.log(`user.dominos`, user.dominos)
        // console.log(`bank`, bank)
        // console.log(`oponent.dominos`, oponent.dominos)
        let b = bank
        let count = 0
        b.forEach((i, parent)=>{
            let index = user.dominos.findIndex((k, slave)=>k&&i.id===k.id)
            if(index!==-1){
                console.log(`user.dominos[index]`, user.dominos[index])
                count ++ 
            }
        })
console.log(`count`, count)
        let subs = subArrs(user.dominos, 3)
        subs.forEach(item => {
            item.sort((a, b) => a.value - b.value)
        })
        let sequencess = []
        subs.forEach(item => {
            if (item.every((e, i, arr) => { if (!arr[i + 1]) return true; return (e.value + 1 === arr[i + 1].value) && (e.color===arr[i+1].color) })) {
                sequencess.push(item)
            }
        })
        let ids = sequencess.map(item => item.map(e => JSON.stringify(e)))
        let filteredIds = ids.filter((item, i, arr) => { return !arr.some((e, j) => { if (i === j) { return false } return isSubArray(e, item) }) })
        let combinations = filteredIds.map(item => item.map(e => JSON.parse(e)))
        setCombinations(combinations.map(item => ({ start: Math.min(...item.map(e => e.i)), end: Math.max(...item.map(e => e.i) )})))
    }, [user, bank])

    useEffect(() => {
        if (selectedDomino) {
            selectedDomino.ref.current.className = styles.selectedDomino
            let indexSpecial = specialLocations.findIndex(item=>item.name === selectedDomino.i)
            if(indexSpecial !== -1){
                selectedDomino.ref.current.style.width="100%";
                selectedDomino.ref.current.style.height="100%";
            }
            dropLocation.current.from = selectedDomino.i 
            let index = selectedDomino.i > 13 ? selectedDomino.i - 13 : selectedDomino.i;
            selectedDomino.styleSetter({
                boxShadow: "0px 0px 10px 10px rgb(0 0 0 / 50%)",
                transform: "scale(1.1)",
                // top: `${selectedDomino.i > 13 ? parseInt(selectedDomino.ref.current.clientHeight) : 0}px`,
                // left: indexSpecial !== -1 ? `${specialLocations[indexSpecial].left}` : `${index * parseInt(selectedDomino.ref.current.clientWidth)}px`,
            })
        }
    }, [selectedDomino])

    function handleMouseUp() {
        if (selectedDomino) {
            selectedDomino.ref.current.className = styles.domino;
            let indexSpecial = specialLocations.find(item=>item.name === dropLocation.current.from)

            let location = dropLocation.current.to ?? dropLocation.current.from
            console.log(`location`, location)
            // let style = typeof location === "number" ? {top: location >= 13 ? "50%" : "0px", left: `calc((100% / 13) * ${location >= 13 ? location - 13 : location})`} : {}
            let style = {
                top:"0px",
                left:"0px"
            }
            if([dropLocation.current.to, dropLocation.current.from].every(it => typeof it === "number")){
                let index =  location >= 13 ? location - 13 : location
                style = {
                    top: location >= 13 ? `${dominosContainerRef.current.clientHeight/2}px` : "0px", 
                    left: `${index * dominosContainerRef.current.clientWidth / 13}px`
                }
            }else if(!indexSpecial){
                style = {
                    top: location >= 13 ? `${dominosContainerRef.current.clientHeight/2}px` : "0px", 
                    left: `${selectedDomino.i * dominosContainerRef.current.clientWidth / 13}px`
                }
            }
            selectedDomino.styleSetter({
                boxShadow: "0px 0px 0px 0px rgb(0 0 0 / 0%)",
                transform: "scale(1)",
                ...style
            })
            dispatch(DROP(dropLocation.current.from, dropLocation.current.to ?? dropLocation.current.from, selectedDomino, indexSpecial))
            dropLocation.current = {from: null, to: null}

            dispatch(UNSELECT_DOMINO())
        }
    }
    function handleDrag(e) {
        if (!selectedDomino) return
        // let rectDomino = selectedDomino.ref.current.getBoundingClientRect()
        let indexSpecial = specialLocations.find(item=>item.name === dropLocation.current.from)
        let rect = dominosContainerRef.current.getBoundingClientRect()
        if (indexSpecial) {
            switch (indexSpecial.name) {
                case "banksOpenedDomino":
                    rect = openedFromBankRef.current.getBoundingClientRect()
                    break;
                case "usersSide":
                    rect = usersDominoRef.current.getBoundingClientRect()
                    break;
                
                default:
                    break;
            }
            
        }
        selectedDomino.styleSetter({
                top: `${e.clientY - rect.top - (selectedDomino.ref.current.clientHeight / 2)}px`,
                left: `${e.clientX - rect.left - (selectedDomino.ref.current.clientWidth / 2)}px`,
            })
        // let cont = selectedDomino.ref.current.closest(`.area > .dropable`)
        // console.log(`cont`, cont)
        selectedDomino.ref.current.style.top = `${e.clientY - rect.top - selectedDomino.ref.current.clientHeight / 2}px`;
        selectedDomino.ref.current.style.left = `${e.clientX - rect.left - selectedDomino.ref.current.clientWidth / 2}px`;
        selectedDomino.ref.current.style.zIndex = 1000;
    }

    return (
        <div className={styles.container} onMouseUp={handleMouseUp} onMouseMove={handleDrag} >
            <div className={styles.gameTable} ref={gameTableRef} >
                <div className={`${styles.bank} ${styles.dominoContainerBorder}`}> {bank.length} </div>
                <div className={`${styles.openedFromBank} ${styles.dominoContainerBorder}`} ref={openedFromBankRef} >{banksOpenedDomino && <Domino i="banksOpenedDomino" item={banksOpenedDomino} /> } </div>
                <div className={styles.nameCont} style={{ top: "0px" }} ><span className={styles.userName} > {oponent.name} </span> <span className={styles.score} > Score: {oponent.score} </span></div>
                <div className={styles.nameCont} style={{ bottom: "41%" }} > <span className={styles.userName} >{user.name} </span> <span className={styles.score} > Score: {user.score} </span></div>
                <div className={styles.dominoContainer} style={{ top: "10px", left: "20px" }} > {oponentsDomino && <Domino item={oponentsDomino} />} </div>
                <div className={styles.dominoContainer} style={{ zIndex: selectedDomino ? 1001 : "unset", top: "39%", left: "89%" }} ref={usersDominoRef} onMouseOver={() => { if (!selectedDomino && !userssDomino) return; dropLocation.current.to = "userSide" }} onMouseLeave={() => { if (!selectedDomino && !userssDomino) return; dropLocation.current.to = null }}> {userssDomino && <Domino i="userSide" item={userssDomino} /> } </div>
                <div className={`area ${styles.dominosContainer}`} ref={dominosContainerRef} >
                    {combinations.map(item=>{
                        return <>
                        <div 
                            className={styles.combScuareBorderRoot} 
                            style={{width:`calc(${(item.end - item.start + 1)} * 100% / 13)`, height:"3px", top: item.start >=13 ? "50%" : "0px", left: `calc(${(item.start>=13 ? item.start - 13 : item.start)} * 100% / 13)`}}
                        />
                        <div 
                            className={styles.combScuareBorderRoot} 
                            style={{width:`calc(${(item.end - item.start + 1)} * 100% / 13)`, height:"3px", top: item.start >=13 ? "100%" : "50%", left: `calc(${(item.start>=13 ? item.start - 13 : item.start)} * 100% / 13)`}}
                        />
                        <div 
                            className={styles.combScuareBorderSide} 
                            style={{width:`3px`, height:"50%", top: item.start >=13 ? "50%" : "0px", left: `calc(${(item.start>=13 ? item.start - 13 : item.start)} * 100% / 13)`}}
                        />
                        <div 
                            className={styles.combScuareBorderSide} 
                            style={{width:`3px`, height:"50%", top: item.start >=13 ? "50%" : "0px", left: `calc(${(item.end>=13 ? item.end - 12 : item.end + 1)} * 100% / 13)`}}
                        />
                        </>
                    })}
                    {user.dominos.map((item, i) => {
                        if (item) {
                            return <div key={item.id} className={styles.singleDominoContiner}>
                                <Domino item={item} i={i} />
                            </div>
                        } else {
                            return <div key={i} style={selectedDomino ? { zIndex: 1001 } : {}} onMouseOver={() => { if (!selectedDomino) return; dropLocation.current.to = i }} onMouseLeave={() => { if (!selectedDomino) return; dropLocation.current.to = null }} className={styles.singleDominoContiner} />
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

function Domino({ item, i }) {
    const dispatch = useDispatch()
    const dominoRef = useRef()
    const [props, setter] = useSpring(() => ({ boxShadow: "0px 0px 0px 0px rgb(0 0 0 / 0%)", transform: "scale(1)", config: { mass: 1, tension: 500, friction: 10 } }))

    function mouseDown(){
        dispatch(SELECT_DOMINO({ item, i: i, ref: dominoRef, styleSetter: setter }))
    }
    return (
        <animated.div
            ref={dominoRef}
            style={
                // i === "userSide" ? 
                // { ...props, position: "absolute", bottom: "41%", right: "20px", height: "20%" } : 
                // i === "banksOpenedDomino" ?
                // { ...props, position: "absolute", top: "20%", left: "52%", height: "20%" } :
                { ...props
                    // , position: "absolute", top: i >= 13 ? "50%" : "0px", left: `calc((100% / 13) * ${i >= 13 ? i - 13 : i})`, 
                }}
            className={styles.domino}
            onMouseDown={mouseDown}
        >
            <div className={styles.Dnumber} style={{ color: item.color }} > {item.value} </div>
            <div className={styles.DStyle}>
                <span className={styles.circle} />
            </div>
        </animated.div>
    )
}
