import { useEffect, useRef } from "react"

export function getInitialBank() {
    let bank = []
    let colors = ["red", "blue", "black", "yellow"]
    colors.forEach(color => {
        let arr = []
        for (let i = 1; i < 14; i++) {
            arr.push({ color: color, value: i, id: `${color}_${i}`, i:i })
        }
        bank.push(...arr)
        arr = []
        for (let i = 14; i < 28; i++) {
            arr.push({ color: color, value: i-13, id: `${i-13}_${color}`, i:i })
        }
        bank.push(...arr)
        arr = []
    })
    return bank;

}

export function subArrs(arr, arr_size) {
    let res = []
    let subRes = [];
    for (let i = 0; i < arr.length; i++) {
        subRes = []
        subRes.push(arr[i])
        for (let j = i + 1; j < arr.length; j++) {
            subRes.push(arr[j])
            subRes.length >= arr_size && subRes.every(item=>item) && res.push([...subRes])
        }
    }
    return res
}

export function isSubArray(master, sub) {
    return sub.every((i => v => i = master.indexOf(v, i) + 1)(0));
}

export function usePrevious(value) {
    const ref = useRef();

    useEffect(() => {
        ref.current = value;
    }, [value]);
    return ref.current;
}