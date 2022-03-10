import { map } from 'ramda'

import { CoinfigType } from '@core/types'
import { createDeepEqualSelector } from '@core/utils'
import { getCoinsSortedByBalance } from 'components/Balances/selectors'
import { selectors } from 'data'
import { REQUEST_ACCOUNTS_SELECTOR } from 'data/coins/model/request'
import { getCoinAccounts } from 'data/coins/selectors'
import { CoinAccountSelectorType } from 'data/coins/types'
import { SwapAccountType, SwapBaseCounterTypes } from 'data/components/swap/types'
import { levenshteinDistanceSearch } from 'services/search'

import { REQUEST_FORM } from '../model'

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
  (
    accounts,
    sortedCoinsR: ReturnType<typeof getCoinsSortedByBalance>,
    isSilverOrAbove,
    formValues: { coinSearch?: string }
  ) => {
    const search = formValues?.coinSearch || 'ALL'
    const prunedAccounts = [] as Array<SwapAccountType>
    const isAtLeastTier1 = isSilverOrAbove
    const lowerSearch = search.toLowerCase()
    // @ts-ignore
    const ethAccount = accounts.ETH.find(({ type }) => type === SwapBaseCounterTypes.ACCOUNT)
    const sortedCoins = sortedCoinsR
      .getOrElse([] as CoinfigType[])
      .map(({ symbol }) => symbol)
      .reverse()

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

    const sortedAccounts = prunedAccounts
      .sort((acc1, acc2) => {
        // if the coin names are the same, sort by descending balance
        if (window.coins[acc1.coin].coinfig.name === window.coins[acc2.coin].coinfig.name) {
          return Number(acc2.balance) - Number(acc1.balance)
        }
        // if the coin name is what the user searched put in front of list
        if (acc1.coin.toLowerCase() === lowerSearch || acc2.coin.toLowerCase() === lowerSearch) {
          return 100
        }

        return (
          levenshteinDistanceSearch(window.coins[acc1.coin].coinfig.name, lowerSearch) -
          levenshteinDistanceSearch(window.coins[acc2.coin].coinfig.name, lowerSearch)
        )
      })
      .sort((acc1, acc2) => {
        return sortedCoins.indexOf(acc1.coin) < sortedCoins.indexOf(acc2.coin) ? 1 : -1
      })

    return { accounts: sortedAccounts, ethAccount, formValues, isAtLeastTier1 }
  }
)
export default getData
