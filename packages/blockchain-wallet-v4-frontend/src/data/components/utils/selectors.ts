import { lift, mapObjIndexed, uniq, values } from 'ramda'

import { BSPaymentTypes, CoinfigType, ExtractSuccess, SwapOrderType } from '@core/types'
import { selectors } from 'data'
import { RootState } from 'data/rootReducer'
import { UserDataType } from 'data/types'

import { getOutputFromPair } from '../swap/model'

// eslint-disable-next-line import/prefer-default-export
export const getCoinsWithBalanceOrMethod = (state: RootState) => {
  const sbMethodsR = selectors.components.buySell.getBSPaymentMethods(state)
  const unifiedBalancesR = selectors.core.data.coins.getUnifiedBalances(state)
  const sbBalancesR = selectors.components.buySell.getBSBalances(state)
  const recentSwapTxs = selectors.custodial.getRecentSwapTxs(state).getOrElse([] as SwapOrderType[])
  const custodials = selectors.core.data.coins.getCustodialCoins()
  const userData = selectors.modules.profile.getUserData(state).getOrElse({} as UserDataType)
  const fiatCurrencies = userData.currencies?.userFiatCurrencies || []

  const transform = (
    unifiedBalances: ExtractSuccess<typeof unifiedBalancesR>,
    paymentMethods: ExtractSuccess<typeof sbMethodsR>,
    sbBalances: ExtractSuccess<typeof sbBalancesR>
  ) => {
    const custodialErc20s = Object.keys(sbBalances)
    const coinsInRecentSwaps = recentSwapTxs.map((tx) => getOutputFromPair(tx.pair))
    const coinsInUnifiedBalances = uniq(unifiedBalances.map(({ ticker }) => ticker))

    const coinOrder = [
      ...new Set([
        ...fiatCurrencies,
        ...coinsInUnifiedBalances,
        ...custodials,
        ...custodialErc20s,
        ...coinsInRecentSwaps
      ])
    ]
      .filter(Boolean)
      .map((coin) => window.coins[coin])

    return values(
      mapObjIndexed((coin: { coinfig: CoinfigType }) => {
        return {
          ...coin,
          method:
            coin.coinfig.type.name !== 'FIAT' ||
            !!paymentMethods.methods.find(
              (method) =>
                method.currency === coin.coinfig.symbol && method.type === BSPaymentTypes.FUNDS
            )
        }
      }, coinOrder)
    )
  }

  return lift(transform)(unifiedBalancesR, sbMethodsR, sbBalancesR)
}

export default getCoinsWithBalanceOrMethod
