import { any, curry, isEmpty, isNil, map, values } from 'ramda'

import { CoinAccountSelectorType } from 'coins/types'
import { CoinType, Erc20CoinsEnum, RemoteDataType } from 'core/types'
import { Remote } from 'core'
import { RootState } from 'data/rootReducer'
import { selectors } from 'data'
import { SUPPORTED_COINS } from 'coins/features/swap'
import { SwapAccountType } from 'data/components/swap/types'

import * as ALGO from './algo'
import * as BCH from './bch'
import * as BTC from './btc'
import * as ERC20 from './erc20'
import * as ETH from './eth'
import * as EUR from './eur'
import * as GBP from './gbp'
import * as USD from './usd'
import * as XLM from './xlm'

// need to create a function map since selectors are created dynamically
const coinSelectors = {
  ALGO,
  BCH,
  BTC,
  ERC20,
  ETH,
  EUR,
  GBP,
  USD,
  XLM
}

// retrieves introduction text for coin on its transaction page
export const getIntroductionText = (coin) =>
  coinSelectors[coin in Erc20CoinsEnum ? 'ERC20' : coin].getTransactionPageHeaderText(coin)

// retrieves custodial account balances
export const getCustodialBalance = curry((coin: CoinType, state) => {
  return selectors.components.simpleBuy.getSBBalances(state).map(x => x[coin])
})

// generic selector that should be used by all features to request their desired
// account types for their coins
export const getCoinAccounts = (state: RootState, ownProps: CoinAccountSelectorType) => {
  const getCoinAccountsR = state => {
    const coinList = ownProps?.coins

    // dynamically create account selectors via passed in coin list
    const accounts = isEmpty(coinList) || isNil(coinList)
      ? Remote.of({})
      : coinList.reduce((accounts, coin) => {
        // @ts-ignore
        accounts[coin] = coinSelectors[coin in Erc20CoinsEnum ? 'ERC20' : coin].getAccounts(state, { coin, ...ownProps })
        return accounts
      }, {})

    const isNotLoaded = coinAccounts => Remote.Loading.is(coinAccounts)
    if (any(isNotLoaded, values(accounts))) return Remote.Loading

    // @ts-ignore
    return Remote.of(map(coinAccounts => isEmpty(coinAccounts) && [] || coinAccounts.getOrElse([]), accounts))
  }

  const accountsR: RemoteDataType<
    any,
    { [key in CoinType]: Array<SwapAccountType> }
    > = getCoinAccountsR(state)

  // @ts-ignore
  const accounts = accountsR.getOrElse(SUPPORTED_COINS
    .reduce((result, item) => {
      result[item] = []
      return result
    }, {})
  )

  return accounts
}