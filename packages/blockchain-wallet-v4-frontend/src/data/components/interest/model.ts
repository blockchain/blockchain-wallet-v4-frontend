import { CoinTypeEnum } from 'core/types'

export const DEFAULT_INTEREST_BALANCE = Object.keys(CoinTypeEnum)
  .filter(key => !isNaN(Number(CoinTypeEnum[key])))
  .reduce((obj, item) => {
    obj[item] = {
      balance: 0,
      fiatAmount: 0,
      pendingDeposit: 0,
      pendingInterest: 0,
      pendingWithdrawal: 0,
      totalInterest: 0
    }
    return obj
  }, {})
export const INVALID_COIN_TYPE = 'Invalid coin type'
