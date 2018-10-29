import { lift } from 'ramda'
import { createDeepEqualSelector } from 'services/ReselectHelper'
import {
  getLockboxBtcBalance,
  getLockboxBchBalance,
  getLockboxEthBalance,
  getLockboxXlmBalance
} from 'components/Balances/lockbox/selectors'

export const getData = createDeepEqualSelector(
  [
    getLockboxBtcBalance,
    getLockboxBchBalance,
    getLockboxEthBalance,
    getLockboxXlmBalance
  ],
  (btcBalanceR, bchBalanceR, ethBalanceR, xlmBalanceR) => {
    const transform = (btcBalance, bchBalance, ethBalance, xlmBalance) => ({
      btcBalance,
      bchBalance,
      ethBalance,
      xlmBalance
    })
    return lift(transform)(btcBalanceR, bchBalanceR, ethBalanceR, xlmBalanceR)
  }
)
