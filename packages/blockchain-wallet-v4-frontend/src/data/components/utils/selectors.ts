import { isNil, lift, mapObjIndexed, reject, values } from 'ramda'

import {
  AccountTokensBalancesResponseType,
  ExtractSuccess,
  SBPaymentTypes,
  SupportedWalletCurrencyType,
  SwapOrderType
} from 'blockchain-wallet-v4/src/types'
import { selectors } from 'data'
import { RootState } from 'data/rootReducer'

import { getOutputFromPair } from '../swap/model'

// eslint-disable-next-line import/prefer-default-export
export const getCoinsWithMethodAndOrder = (state: RootState) => {
  const sbMethodsR = selectors.components.simpleBuy.getSBPaymentMethods(state)
  // TODO, check all custodial features
  const sbBalancesR = selectors.components.simpleBuy.getSBBalances(state)
  const coinsR = selectors.core.walletOptions.getSupportedCoins(state)
  const erc20sR = selectors.core.data.eth.getErc20AccountTokenBalances(state)
  const recentSwapTxs = selectors.custodial.getRecentSwapTxs(state).getOrElse([] as SwapOrderType[])

  const transform = (
    paymentMethods: ExtractSuccess<typeof sbMethodsR>,
    sbBalances: ExtractSuccess<typeof sbBalancesR>,
    coins: ExtractSuccess<typeof coinsR>,
    erc20s: AccountTokensBalancesResponseType['tokenAccounts']
  ) => {
    const custodialErc20s = Object.keys(sbBalances).filter(
      (coin) => window.coins[coin] && window.coins[coin].coinfig.type.erc20Address
    )
    const coinsInRecentSwaps = recentSwapTxs.map((tx) => getOutputFromPair(tx.pair))
    // remove coins that may not yet exist in wallet options to avoid app crash
    const coinOrder = reject(isNil)([
      coins.USD,
      coins.EUR,
      coins.GBP,
      coins.BTC,
      coins.ETH,
      coins.BCH,
      coins.XLM,
      coins.ALGO,
      coins.DOT,
      coins.CLOUT,
      coins.DOGE,
      // ...coins.rest // erc20s
      ...[
        ...new Set([
          ...erc20s.map(({ tokenSymbol }) => tokenSymbol),
          ...custodialErc20s,
          ...coinsInRecentSwaps
        ])
      ].map((value) => {
        return window.coins[value]
      })
    ])

    return values(
      mapObjIndexed((coin: SupportedWalletCurrencyType) => {
        return {
          ...coin,
          method:
            !coin.coinfig.type.isFiat ||
            !!paymentMethods.methods.find(
              (method) => method.currency === coin.coinCode && method.type === SBPaymentTypes.FUNDS
            )
        }
      }, coinOrder)
    )
  }

  return lift(transform)(sbMethodsR, sbBalancesR, coinsR, erc20sR)
}

export default getCoinsWithMethodAndOrder
