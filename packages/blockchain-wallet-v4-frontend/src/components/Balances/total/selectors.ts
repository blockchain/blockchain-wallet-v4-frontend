import { lift } from 'ramda'

import { fiatToString } from 'blockchain-wallet-v4/src/exchange/utils'
import { createDeepEqualSelector } from 'blockchain-wallet-v4/src/utils'
import { selectors } from 'data'

import * as S from '../selectors'

export const getTotalBalance = createDeepEqualSelector(
  [
    S.getBchBalanceInfo,
    S.getBtcBalanceInfo,
    S.getEthBalanceInfo,
    S.getXlmBalanceInfo,
    S.getFiatBalanceInfo,
    S.getErc20BalancesInfoV2,
    S.getCoinsBalanceInfo,
    selectors.core.settings.getCurrency,
    selectors.router.getPathname
  ],
  (
    bchBalanceInfoR,
    btcBalanceInfoR,
    ethBalanceInfoR,
    xlmBalanceInfoR,
    fiatBalanceInfoR,
    erc20BalancesInfoV2,
    coinsBalanceInfo,
    currency,
    path
  ) => {
    const transform = (
      bchBalance,
      btcBalance,
      ethBalance,
      xlmBalance,
      fiatBalance,
      erc20BalancesInfoV2,
      coinsBalanceInfo,
      currency
    ) => {
      const balanceReducer = (acc, cur) => acc + Number(cur.getOrElse('0'))
      const erc20Balance = erc20BalancesInfoV2.reduce(balanceReducer, 0)
      const coinsBalance = coinsBalanceInfo.reduce(balanceReducer, 0)
      const total =
        Number(bchBalance) +
        Number(btcBalance) +
        Number(ethBalance) +
        Number(xlmBalance) +
        Number(fiatBalance) +
        erc20Balance +
        coinsBalance
      const totalBalance = `${fiatToString({ unit: currency, value: total })}`
      return { path, totalBalance }
    }

    return lift(transform)(
      bchBalanceInfoR,
      btcBalanceInfoR,
      ethBalanceInfoR,
      xlmBalanceInfoR,
      fiatBalanceInfoR,
      erc20BalancesInfoV2,
      coinsBalanceInfo,
      currency
    )
  }
)
