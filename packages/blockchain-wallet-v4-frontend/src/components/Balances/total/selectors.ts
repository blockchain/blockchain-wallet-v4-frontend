import { lift } from 'ramda'

import { Exchange } from 'blockchain-wallet-v4/src'
import * as Currency from 'blockchain-wallet-v4/src/exchange/currency'
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
    S.getErc20BalancesInfo,
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
    erc20BalancesInfo,
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
      erc20BalancesInfo,
      currency
    ) => {
      const total = Currency.formatFiat(
        Number(algoBalance) +
          Number(bchBalance) +
          Number(btcBalance) +
          Number(ethBalance) +
          Number(dotBalance) +
          Number(xlmBalance) +
          Number(erc20BalancesInfo) +
          Number(fiatBalance)
      )
      const totalBalance = `${Exchange.getSymbol(currency)}${total}`
      return { totalBalance, path }
    }
    return lift(transform)(
      algoBalanceInfoR,
      bchBalanceInfoR,
      btcBalanceInfoR,
      dotBalanceInfoR,
      ethBalanceInfoR,
      xlmBalanceInfoR,
      fiatBalanceInfoR,
      erc20BalancesInfo,
      currency
    )
  }
)
