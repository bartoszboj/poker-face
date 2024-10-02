import type { Timestamp } from 'firebase-admin/firestore'

declare global {
    type UserData = {
        avatar?: {
            icon?: string
            image?: string
            thumbnail?: string
        }
        created_at: Timestamp
        defaultSettings?: GameSettings
        email: string
        friends?: string[]
        groups?: string[]
        informalPoints?: number
        matchHistory?: string[]
        name?: string
        pendingMatches?: string[]
        rankedPoints: number
        surname?: string
        uid: string
        username: string
    }

    type UserGameData = {
        avatar?: {
            icon?: string
            image?: string
            thumbnail?: string
        }
        informalPoints?: number
        rankedPoints: number
        uid: string
        username: string
        chipPoolValueChanged?: boolean
        chipPool: number
    }
}
