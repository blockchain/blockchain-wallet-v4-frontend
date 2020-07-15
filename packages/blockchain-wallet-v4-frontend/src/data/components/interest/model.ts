import { CoinTypeEnum } from 'blockchain-wallet-v4/src/types'

export const DEFAULT_INTEREST_BALANCE = {
  balance: '0',
  fiatAmount: '0',
  locked: '0',
  pendingDeposit: '0',
  pendingInterest: '0',
  pendingWithdrawal: '0',
  totalInterest: '0'
}

export const DEFAULT_INTEREST_BALANCES = Object.keys(CoinTypeEnum)
  .filter(key => !isNaN(Number(CoinTypeEnum[key])))
  .reduce((obj, item) => {
    obj[item] = DEFAULT_INTEREST_BALANCE
    return obj
  }, {})
