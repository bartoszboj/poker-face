import type { Timestamp } from 'firebase/firestore'

declare global {
    type GameSettings = {
        chipPool: number
        chipValue: number
        isMoney: boolean
        isRanked: boolean
        moneyPool: number
        status?: string
        id?: string
    }

    type GamePayload = {
        created_at: Timestamp
        gameSettings: GameSettings
        players: UserGameData[]
        status: string
        id?: string
    }
}
