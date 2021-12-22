import { map } from 'ramda'

import { CoinfigType } from '@core/types'
import { createDeepEqualSelector } from '@core/utils'
import { getCoinsSortedByBalance } from 'components/Balances/selectors'
import { selectors } from 'data'
import { REQUEST_ACCOUNTS_SELECTOR } from 'data/coins/model/request'
import { getCoinAccounts } from 'data/coins/selectors'
import { CoinAccountSelectorType } from 'data/coins/types'
import { SwapAccountType, SwapBaseCounterTypes } from 'data/components/swap/types'

import { REQUEST_FORM } from '../model'

// https://stackoverflow.com/a/11958496
const levDist = function (s, t) {
  const d: Array<Array<number>> = [] // 2d matrix

  // Step 1
  const n = s.length
  const m = t.length

  if (n === 0) return m
  if (m === 0) return n

  // Create an array of arrays in javascript (a descending loop is quicker)
  for (let i = n; i >= 0; i -= 1) d[i] = []

  // Step 2
  for (let i = n; i >= 0; i -= 1) d[i][0] = i
  for (let j = m; j >= 0; j -= 1) d[0][j] = j

  // Step 3
  for (let i = 1; i <= n; i += 1) {
    const s_i = s.charAt(i - 1)

    // Step 4
    for (let j = 1; j <= m; j += 1) {
      // Check the jagged ld total so far
      if (i === j && d[i][j] > 4) return n

      const t_j = t.charAt(j - 1)
      const cost = s_i === t_j ? 0 : 1 // Step 5

      // Calculate the minimum
      let mi = d[i - 1][j] + 1
      const b = d[i][j - 1] + 1
      const c = d[i - 1][j - 1] + cost

      if (b < mi) mi = b
      if (c < mi) mi = c

      d[i][j] = mi // Step 6

      // Damerau transposition
      if (i > 1 && j > 1 && s_i === t.charAt(j - 2) && s.charAt(i - 2) === t_j) {
        d[i][j] = Math.min(d[i][j], d[i - 2][j - 2] + cost)
      }
    }
  }

  // Step 7
  return d[n][m]
}

export const getData = createDeepEqualSelector(
  [
    (state, ownProps) =>
      getCoinAccounts(state, {
        coins: ownProps.requestableCoins,
        ...REQUEST_ACCOUNTS_SELECTOR
      } as CoinAccountSelectorType),
    getCoinsSortedByBalance,
    selectors.modules.profile.isSilverOrAbove,
    selectors.form.getFormValues(REQUEST_FORM)
  ],
  (accounts, sortedCoinsR, isSilverOrAbove, formValues: { coinSearch?: string }) => {
    const search = formValues?.coinSearch || 'ALL'
    const prunedAccounts = [] as Array<SwapAccountType>
    const isAtLeastTier1 = isSilverOrAbove
    const lowerSearch = search.toLowerCase()
    const sortedCoins = sortedCoinsR
      .getOrElse([] as CoinfigType[])
      .map((coinfig) => coinfig.symbol)
      .reverse()
    // @ts-ignore
    const ethAccount = accounts.ETH.find(({ type }) => type === SwapBaseCounterTypes.ACCOUNT)

    // @ts-ignore
    map(
      (coinAccounts) =>
        map((coinAccount: SwapAccountType) => {
          const { coinfig } = window.coins[coinAccount.coin]
          const lowerSearch = search.toLowerCase()
          let include = false

          if (search === 'ALL') include = true
          if (coinAccount.coin.toLowerCase().includes(lowerSearch)) include = true
          if (coinfig.name.toLowerCase().includes(lowerSearch)) include = true
          if (coinfig.displaySymbol.toLowerCase().includes(lowerSearch)) include = true

          if (include) prunedAccounts.push(coinAccount)
        }, coinAccounts),
      accounts
    )

    // this sorts the accounts based on the position of their symbol in the coinsort array
    const sortedAccounts = prunedAccounts.sort((acc1, acc2) => {
      const balanceDiff = Number(acc2.balance) - Number(acc1.balance)
      if (balanceDiff !== 0) {
        return balanceDiff
      }

      return (
        levDist(window.coins[acc1.coin].coinfig.name, lowerSearch) -
        levDist(window.coins[acc2.coin].coinfig.name, lowerSearch)
      )
    })

    return { accounts: sortedAccounts, ethAccount, formValues, isAtLeastTier1 }
  }
)
export default getData
