import { isNil, lift, mapObjIndexed, reject, values } from 'ramda'

import {
  AccountTokensBalancesResponseType,
  ExtractSuccess,
  SBPaymentTypes,
  SupportedWalletCurrencyType
} from 'blockchain-wallet-v4/src/types'
import { selectors } from 'data'
import { RootState } from 'data/rootReducer'

// eslint-disable-next-line import/prefer-default-export
export const getCoinsWithMethodAndOrder = (state: RootState) => {
  const sbMethodsR = selectors.components.simpleBuy.getSBPaymentMethods(state)
  const coinsR = selectors.core.walletOptions.getSupportedCoins(state)
  const erc20sR = selectors.core.data.eth.getErc20AccountTokenBalances(state)

  const transform = (
    paymentMethods: ExtractSuccess<typeof sbMethodsR>,
    coins: ExtractSuccess<typeof coinsR>,
    erc20s: AccountTokensBalancesResponseType['tokenAccounts']
  ) => {
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
      // ...coins.rest // erc20s
      ...erc20s.map((value) => {
        return window.coins[value.symbol!]
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

  return lift(transform)(sbMethodsR, coinsR, erc20sR)
}

export default getCoinsWithMethodAndOrder
