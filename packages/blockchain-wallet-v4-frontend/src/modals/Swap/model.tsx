import { SwapAccountType, SwapCoinType } from 'data/components/swap/types'

export const checkAccountZeroBalance = (
  accounts: { [key in SwapCoinType]: Array<SwapAccountType> }
): boolean => {
  let allAccounts: Array<SwapAccountType> = []

  // eslint-disable-next-line no-restricted-syntax, guard-for-in
  for (const coin in accounts) {
    // eslint-disable-next-line no-restricted-syntax
    for (const account of accounts[coin]) {
      allAccounts = [...allAccounts, account]
    }
  }

  return allAccounts.every((account) => account.balance === 0 || account.balance === '0')
}

export default checkAccountZeroBalance
