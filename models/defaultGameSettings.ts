import EnumGameStatus from '~/Enums/EnumGameStatus'

export default class defaultGameSettings {
    isRanked: boolean = false
    isMoney: boolean = false
    chipPool: number = 1000
    chipValue: number = 1
    moneyPool: number = 0
    status?: string = EnumGameStatus.PENDING
    id?: string = ''
}
