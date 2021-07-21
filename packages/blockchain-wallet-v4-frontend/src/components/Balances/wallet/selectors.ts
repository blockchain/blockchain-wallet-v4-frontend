import { lift } from 'ramda'

import { Exchange } from 'blockchain-wallet-v4/src'
import { fiatToString, formatFiat } from 'blockchain-wallet-v4/src/exchange/utils'
import { createDeepEqualSelector } from 'blockchain-wallet-v4/src/utils'
import { selectors } from 'data'

import * as S from '../selectors'

export const getTotalBalance = createDeepEqualSelector(
  [
    S.getBchBalanceInfo,
    S.getBtcBalanceInfo,
    S.getDotBalanceInfo,
    S.getEthBalanceInfo,
    S.getXlmBalanceInfo,
    S.getFiatBalanceInfo,
    S.getErc20BalancesInfoV2,
    selectors.core.settings.getCurrency
  ],
  (
    btcBalanceInfoR,
    bchBalanceInfoR,
    dotBalanceInfoR,
    ethBalanceInfoR,
    xlmBalanceInfoR,
    fiatBalanceInfoR,
    erc20BalancesInfoV2,
    currency
  ) => {
    const transform = (
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
      const total =
        Number(btcBalance) +
        Number(dotBalance) +
        Number(ethBalance) +
        Number(bchBalance) +
        Number(xlmBalance) +
        Number(fiatBalance) +
        erc20Balance
      const totalBalance = `${fiatToString({ unit: currency, value: total })}`
      return { totalBalance }
    }
    return lift(transform)(
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
