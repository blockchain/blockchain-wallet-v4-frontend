import { any, isEmpty, isNil, map, values } from 'ramda'

import { Remote } from 'blockchain-wallet-v4/src'
import { CoinfigType, CoinType, RemoteDataType } from 'blockchain-wallet-v4/src/types'
import { selectors } from 'data'
import { CoinAccountSelectorType } from 'data/coins/types'
import { SwapAccountType } from 'data/components/swap/types'
import { RootState } from 'data/rootReducer'

import * as BCH from './coins/bch'
import * as BTC from './coins/btc'
import * as CUSTODIAL from './coins/custodial'
import * as ERC20 from './coins/erc20'
import * as ETH from './coins/eth'
import * as EUR from './coins/eur'
import * as GBP from './coins/gbp'
import * as USD from './coins/usd'
import * as XLM from './coins/xlm'

// create a function map of all coins
const coinSelectors = {
  BCH,
  BTC,
  CUSTODIAL,
  ERC20,
  ETH,
  EUR,
  GBP,
  USD,
  XLM
}

export const getSelector = (coinfig: CoinfigType) => {
  if (coinfig.type.erc20Address) {
    return 'ERC20'
  }
  if (selectors.core.data.coins.getCustodialCoins().includes(coinfig.symbol)) {
    return 'CUSTODIAL'
  }
  return coinfig.symbol
}

// retrieves introduction text for coin on its transaction page
export const getIntroductionText = (coin: string) => {
  const { coinfig } = window.coins[coin]
  const selector = getSelector(coinfig)
  return coinSelectors[selector]?.getTransactionPageHeaderText(coinfig.symbol)
}

// retrieves custodial account balances
export const getTradingBalance = (coin: CoinType, state) => {
  return selectors.components.simpleBuy.getSBBalances(state).map((x) => x[coin])
}

// retrieves custodial account balances
export const getInterestBalance = (coin: CoinType, state) => {
  return selectors.components.interest.getInterestAccountBalance(state).map((x) => x[coin])
}

// generic selector that should be used by all features to request their desired
// account types for their coins
export const getCoinAccounts = (state: RootState, ownProps: CoinAccountSelectorType) => {
  const getCoinAccountsR = (state) => {
    const coinList = ownProps?.coins

    // dynamically create account selectors via passed in coin list
    const accounts =
      isEmpty(coinList) || isNil(coinList)
        ? Remote.of({})
        : coinList.reduce((accounts, coin) => {
            const { coinfig } = window.coins[coin]
            const selector = getSelector(coinfig)
            // eslint-disable-next-line
            accounts[coin] = coinSelectors[selector]?.getAccounts(state, { coin, ...ownProps })
            return accounts
          }, {})

    const isNotLoaded = (coinAccounts) => Remote.Loading.is(coinAccounts)
    if (any(isNotLoaded, values(accounts))) return Remote.Loading

    // @ts-ignore
    return Remote.of(
      map((coinAccounts) => (isEmpty(coinAccounts) && []) || coinAccounts.getOrElse([]), accounts)
    )
  }

  const accountsR: RemoteDataType<any, { [key in CoinType]: Array<SwapAccountType> }> =
    getCoinAccountsR(state)

  const accounts = accountsR.getOrElse({})

  return accounts
}
