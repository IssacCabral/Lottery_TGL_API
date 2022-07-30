import Game from '../Models/Game'

interface BetValidate{
    gameId: number
    numbers: string[]
}

interface BetsToCreate{
    gameId: number
    numbers: string
}

interface ErrorValidate{
    message: string
}

interface ProcessorResults{
    errors: ErrorValidate[],
    betsToCreate: BetsToCreate[],
    cartTotalValue: number
}

export default async function ValidateBetNUmbers(bets: BetValidate[], minCartValue: number): Promise<ProcessorResults>{
    const errors: ErrorValidate[] = []
    const betsToCreate: BetsToCreate[] = []

    let cartTotalValue:number = 0

    await Promise.all(
        bets.map(async (bet) => {
            const game = await Game.findByOrFail('id', bet.gameId)
            
            if(bet.numbers.length !== game.minAndMaxNumber){
                errors.push({
                    message: `The ${game.type} only allows ${game.minAndMaxNumber} numbers choosen`
                })
            }

            cartTotalValue += game.price

            betsToCreate.push({
                gameId: game.id,
                numbers: bet.numbers.join(',')
            })
        })
    )
    
    if(cartTotalValue < minCartValue){
        errors.push({
            message: `your cart must have a minimum value of ${minCartValue}`
        })
    }

    return {errors, betsToCreate, cartTotalValue}
}