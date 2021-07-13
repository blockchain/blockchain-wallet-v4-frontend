import { lift } from 'ramda'

import { Exchange } from 'blockchain-wallet-v4/src'
import { formatFiat } from 'blockchain-wallet-v4/src/exchange/currency'
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
    S.getErc20BalancesInfo,
    selectors.core.settings.getCurrency
  ],
  (
    btcBalanceInfoR,
    bchBalanceInfoR,
    dotBalanceInfoR,
    ethBalanceInfoR,
    xlmBalanceInfoR,
    fiatBalanceInfoR,
    erc20BalancesInfo,
    currency
  ) => {
    const transform = (
      bchBalance,
      btcBalance,
      dotBalance,
      ethBalance,
      xlmBalance,
      fiatBalance,
      erc20Balances,
      currency
    ) => {
      const total = formatFiat(
        Number(btcBalance) +
          Number(dotBalance) +
          Number(ethBalance) +
          Number(bchBalance) +
          Number(xlmBalance) +
          Number(erc20Balances) +
          Number(fiatBalance)
      )
      const totalBalance = `${Exchange.getSymbol(currency)}${total}`
      return { totalBalance }
    }
    return lift(transform)(
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
