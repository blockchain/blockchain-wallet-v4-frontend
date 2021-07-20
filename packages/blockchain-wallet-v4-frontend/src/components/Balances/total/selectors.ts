import { lift } from 'ramda'

import { fiatToString } from 'blockchain-wallet-v4/src/exchange/utils'
import { createDeepEqualSelector } from 'blockchain-wallet-v4/src/utils'
import { selectors } from 'data'

import * as S from '../selectors'

export const getTotalBalance = createDeepEqualSelector(
  [
    S.getAlgoBalanceInfo,
    S.getBchBalanceInfo,
    S.getBtcBalanceInfo,
    S.getCloutBalanceInfo,
    S.getDogeBalanceInfo,
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
    dogeBalanceInfoR,
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
      // cloutBalance,
      // dogeBalance,
      // dotBalance,
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
        Number(algoBalance) +
        Number(bchBalance) +
        Number(btcBalance) +
        Number(ethBalance) +
        Number(cloutBalanceInfoR.getOrElse('0')) +
        Number(dogeBalanceInfoR.getOrElse('0')) +
        Number(dotBalanceInfoR.getOrElse('0')) +
        Number(xlmBalance) +
        Number(fiatBalance) +
        erc20Balance
      const totalBalance = `${fiatToString({ unit: currency, value: total })}`
      return { path, totalBalance }
    }

    return lift(transform)(
      algoBalanceInfoR,
      bchBalanceInfoR,
      btcBalanceInfoR,
      // cloutBalanceInfoR,
      // dogeBalanceInfoR,
      // dotBalanceInfoR,
      ethBalanceInfoR,
      xlmBalanceInfoR,
      fiatBalanceInfoR,
      erc20BalancesInfoV2,
      currency
    )
  }
)
