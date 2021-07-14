import { lift } from 'ramda'

import { fiatToString, formatFiat } from 'blockchain-wallet-v4/src/exchange/utils'
import { createDeepEqualSelector } from 'blockchain-wallet-v4/src/utils'
import { selectors } from 'data'

import * as S from '../selectors'

export const getTotalBalance = createDeepEqualSelector(
  [
    S.getAlgoBalanceInfo,
    S.getBchBalanceInfo,
    S.getBtcBalanceInfo,
    S.getDotBalanceInfo,
    S.getEthBalanceInfo,
    S.getXlmBalanceInfo,
    S.getFiatBalanceInfo,
    S.getErc20BalancesInfoV2,
    selectors.core.settings.getCurrency,
    selectors.router.getPathname
  ],
  (
    algoBalanceInfoR,
    bchBalanceInfoR,
    btcBalanceInfoR,
    dotBalanceInfoR,
    ethBalanceInfoR,
    xlmBalanceInfoR,
    fiatBalanceInfoR,
    erc20BalancesInfoV2,
    currency,
    path
  ) => {
    const transform = (
      algoBalance,
      bchBalance,
      btcBalance,
      dotBalance,
      ethBalance,
      xlmBalance,
      fiatBalance,
      erc20BalancesInfoV2,
      currency
    ) => {
      const erc20Balance = erc20BalancesInfoV2.reduce(
        (acc, cur) => (acc += Number(cur.getOrElse('0'))),
        0
      )
      const total = formatFiat(
        Number(algoBalance) +
          Number(bchBalance) +
          Number(btcBalance) +
          Number(ethBalance) +
          Number(dotBalance) +
          Number(xlmBalance) +
          Number(fiatBalance) +
          erc20Balance
      )
      const totalBalance = `${fiatToString({ unit: currency, value: total })}`
      return { path, totalBalance }
    }
    return lift(transform)(
      algoBalanceInfoR,
      bchBalanceInfoR,
      btcBalanceInfoR,
      dotBalanceInfoR,
      ethBalanceInfoR,
      xlmBalanceInfoR,
      fiatBalanceInfoR,
      erc20BalancesInfoV2,
      currency
    )
  }
)
