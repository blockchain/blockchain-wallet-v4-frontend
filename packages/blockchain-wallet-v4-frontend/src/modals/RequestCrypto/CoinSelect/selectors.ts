import { isEmpty, map, prop, sortBy } from 'ramda'

import { CoinfigType } from '@core/types'
import { createDeepEqualSelector } from '@core/utils'
import { getCoinsSortedByBalance } from 'components/Balances/selectors'
import { selectors } from 'data'
import { REQUEST_ACCOUNTS_SELECTOR } from 'data/coins/model/request'
import { getCoinAccounts } from 'data/coins/selectors'
import { CoinAccountSelectorType } from 'data/coins/types'
import { SwapAccountType, SwapBaseCounterTypes } from 'data/components/swap/types'

import { REQUEST_FORM } from '../model'

const fuzzyAlgorithm = (a: string, b: string): number => {
  if (a === b) return 0
  let smallStr = a.toLowerCase()
  let bigStr = b.toLowerCase()

  if (a.length !== b.length) {
    if (a.length > b.length) {
      const temp = smallStr
      smallStr = bigStr
      bigStr = temp
    }
  }

  if (!isEmpty(smallStr) && bigStr.startsWith(a.substr(0, Math.floor(smallStr.length / 1.5) + 1))) {
    return 0
  }
  if (isEmpty(smallStr)) return isEmpty(bigStr) ? 0 : 1

  let j = 0
  for (let i = 0; i < bigStr.length; i += 1) {
    const char = bigStr[i]
    const char2 = smallStr[j]
    if (char === char2) j += 1
    if (j >= smallStr.length) return 0.1
  }

  return bigStr.length > 1 ? 1 : 0
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

    const sortedAccounts = prunedAccounts.sort(
      (acc1, acc2) =>
        fuzzyAlgorithm(window.coins[acc1.coin].coinfig.name, lowerSearch) -
        fuzzyAlgorithm(window.coins[acc2.coin].coinfig.name, lowerSearch)
    )

    return { accounts: sortedAccounts, ethAccount, formValues, isAtLeastTier1 }
  }
)
export default getData
