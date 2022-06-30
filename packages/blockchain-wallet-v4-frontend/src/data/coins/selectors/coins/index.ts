import { any, isEmpty, isNil, map, values } from 'ramda'

import { Remote } from '@core'
import { CoinfigType, CoinType, RemoteDataType } from '@core/types'
import { selectors } from 'data'
import { CoinAccountSelectorType } from 'data/coins/types'
import { SwapAccountType } from 'data/components/swap/types'
import { RootState } from 'data/rootReducer'

import * as ARS from './ars'
import * as BCH from './bch'
import * as BTC from './btc'
import * as CUSTODIAL from './custodial'
import * as DYNAMIC_SELF_CUSTODY from './dynamic-self-custody'
import * as ERC20 from './erc20'
import * as ETH from './eth'
import * as EUR from './eur'
import * as GBP from './gbp'
import * as USD from './usd'
import * as XLM from './xlm'

// create a function map of all coins
const coinSelectors = {
  ARS,
  BCH,
  BTC,
  CUSTODIAL,
  DYNAMIC_SELF_CUSTODY,
  ERC20,
  ETH,
  EUR,
  GBP,
  USD,
  XLM
}

// internal util get locate correct selectors
const __getSelector = (coinfig: CoinfigType) => {
  if (selectors.core.data.coins.getErc20Coins().includes(coinfig.symbol)) {
    return 'ERC20'
  }
  if (selectors.core.data.coins.getDynamicSelfCustodyCoins().includes(coinfig.symbol)) {
    return 'DYNAMIC_SELF_CUSTODY'
  }
  if (selectors.core.data.coins.getCustodialCoins().includes(coinfig.symbol)) {
    return 'CUSTODIAL'
  }
  return coinfig.symbol
}

// retrieves introduction text for coin on its transaction page
const getIntroductionText = (coin: string) => {
  const { coinfig } = window.coins[coin]
  const selector = __getSelector(coinfig)
  return coinSelectors[selector]?.getTransactionPageHeaderText(coinfig.symbol)
}

// generic selector that should be used by all features to request their desired
// account types for their coins
const getCoinAccounts = (state: RootState, ownProps: CoinAccountSelectorType) => {
  const getCoinAccountsR = (state: RootState) => {
    const coinList = ownProps?.coins

    // dynamically create account selectors via passed in coin list
    const accounts =
      isEmpty(coinList) || isNil(coinList)
        ? Remote.of({})
        : coinList.reduce((accounts, coin) => {
            const { coinfig } = window.coins[coin]
            const selector = __getSelector(coinfig)
            // eslint-disable-next-line
          accounts[coin] = coinSelectors[selector]?.getAccounts(state, { coin, ...ownProps })
            return accounts
          }, {})

    const isNotLoaded = (coinAccounts) => Remote.Loading.is(coinAccounts)
    if (any(isNotLoaded, values(accounts))) return Remote.Loading

    // @ts-ignore
    return Remote.of(
      map(
        (coinAccounts: RemoteDataType<any, typeof accounts>) =>
          (isEmpty(coinAccounts) && []) || (coinAccounts ? coinAccounts.getOrElse([]) : []),
        accounts
      ) as any
    )
  }

  const accountsR: RemoteDataType<any, { [key in CoinType]: Array<SwapAccountType> }> =
    getCoinAccountsR(state)

  return accountsR?.getOrElse({}) || {}
}

export * from './dynamic-self-custody'
export { getCoinAccounts, getIntroductionText }
