import { useEffect, useRef } from "react"

export function getInitialBank(){
    let bank = []
    let colors = ["red", "blue", "black", "yellow"] 
    colors.forEach(color=>{
        let arr = []
        for(let i=1; i<14; i++){
            arr.push({color: color, value: i, id:`${color}_${i}`})
        }
        bank.push(...arr)
        arr = []
        for(let i=1; i<14; i++){
            arr.push({color: color, value: i, id:`${i}_${color}`})
        }
        bank.push(...arr)
        arr = []
    })
    return bank;
    
}


export function usePrevious(value) {
    const ref = useRef();
    
    useEffect(() => {
      ref.current = value;
    }, [value]);
    return ref.current;
  }