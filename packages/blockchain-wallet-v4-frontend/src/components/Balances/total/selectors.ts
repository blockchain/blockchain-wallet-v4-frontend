import { lift } from 'ramda'

import { fiatToString } from 'blockchain-wallet-v4/src/exchange/utils'
import { createDeepEqualSelector } from 'blockchain-wallet-v4/src/utils'
import { selectors } from 'data'

import * as S from '../selectors'

export const getTotalBalance = createDeepEqualSelector(
  [
    S.getFiatBalanceInfo,
    S.getCoinsBalanceInfo,
    selectors.core.settings.getCurrency,
    selectors.router.getPathname
  ],
  (fiatBalanceInfoR, coinsBalanceInfo, currency, path) => {
    const transform = (fiatBalance, coinsBalanceInfo, currency) => {
      const balanceReducer = (acc, cur) => acc + Number(cur.getOrElse('0'))
      const coinsBalance = coinsBalanceInfo.reduce(balanceReducer, 0)
      const total = Number(fiatBalance) + coinsBalance
      const totalBalance = `${fiatToString({ unit: currency, value: total })}`
      return { path, totalBalance }
    }

    return lift(transform)(fiatBalanceInfoR, coinsBalanceInfo, currency)
  }
)
