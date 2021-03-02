import { SwapAccountType, SwapCoinType } from 'data/components/swap/types'

const checkAccountZeroBalance = (
  accounts: { [key in SwapCoinType]: Array<SwapAccountType> }
): boolean => {
  let allAccounts: Array<SwapAccountType> = []

  for (const coin in accounts) {
    for (const account of accounts[coin]) {
      allAccounts = [...allAccounts, account]
    }
  }

  return allAccounts.every(
    account => account.balance === 0 || account.balance === '0'
  )
}

export default checkAccountZeroBalance
