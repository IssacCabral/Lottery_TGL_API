import randomNumbers from "./random-numbers";

export default function randomBet(maxNumber: number, range: number): Array<string>{
    const numbers: Array<string> = []

    for(let i = 0; i < maxNumber; i++){
        numbers.push(String(randomNumbers(1, range)))
    }
    return numbers
}