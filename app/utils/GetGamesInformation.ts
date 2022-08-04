import Game from "App/Models/Game";

interface BetsToCreate{
    gameId: number
    numbers: string
}


interface GameInformation{
    type: string
    numbers: string
    color: string
}

export default async function GetGamesInformation(betsToCreate: BetsToCreate[]): Promise<GameInformation[]>{
    const GamesInformation: GameInformation[] = []

    await Promise.all(
        betsToCreate.map(async (bet) => {
            try{
                const game = await Game.findByOrFail('id', bet.gameId)

                GamesInformation.push({type: game!.type, numbers: bet.numbers, color: game.color})

            } catch(error){
                return {message: `gameID:${bet.gameId} not found`, originalError: error.message}
            }
        })
    )

    return GamesInformation
}