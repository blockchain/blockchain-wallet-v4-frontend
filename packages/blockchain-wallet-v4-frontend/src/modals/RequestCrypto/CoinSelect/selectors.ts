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

    const sortedAccounts = prunedAccounts.sort((acc1, acc2) => {
      return sortedCoins.indexOf(acc2.coin) > sortedCoins.indexOf(acc1.coin) ? 1 : -1
    })

    return { accounts: sortedAccounts, ethAccount, formValues, isAtLeastTier1 }
  }
)
export default getData
