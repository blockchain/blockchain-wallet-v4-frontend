import { lift } from 'ramda'

import { Exchange } from 'blockchain-wallet-v4/src'
import { formatFiat } from 'blockchain-wallet-v4/src/exchange/utils'
import { createDeepEqualSelector } from 'blockchain-wallet-v4/src/utils'
import { selectors } from 'data'

import * as S from '../selectors'

export const getTotalBalance = createDeepEqualSelector(
  [
    S.getAlgoBalanceInfo,
    S.getBchBalanceInfo,
    S.getBtcBalanceInfo,
    S.getCloutBalanceInfo,
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
    cloutBalanceInfoR,
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
      cloutBalance,
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
          Number(cloutBalance) +
          Number(ethBalance) +
          Number(dotBalance) +
          Number(xlmBalance) +
          Number(fiatBalance) +
          erc20Balance
      )
      const totalBalance = `${Exchange.getSymbol(currency)}${total}`
      return { path, totalBalance }
    }
    return lift(transform)(
      algoBalanceInfoR,
      bchBalanceInfoR,
      btcBalanceInfoR,
      cloutBalanceInfoR,
      dotBalanceInfoR,
      ethBalanceInfoR,
      xlmBalanceInfoR,
      fiatBalanceInfoR,
      erc20BalancesInfoV2,
      currency
    )
  }
)
