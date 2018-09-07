import { selectors } from 'data'
import { lift } from 'ramda'
import { createDeepEqualSelector } from 'services/ReselectHelper'
import {
  getLockboxBtcBalance,
  getLockboxBchBalance,
  getLockboxEthBalance
} from 'components/Balances/lockbox/selectors'

export const getData = createDeepEqualSelector(
  [getLockboxBtcBalance, getLockboxBchBalance, getLockboxEthBalance],
  (btcBalanceR, bchBalanceR, ethBalanceR) => {
    const transform = (btcBalance, bchBalance, ethBalance) => ({
      btcBalance,
      bchBalance,
      ethBalance
    })
    return lift(transform)(btcBalanceR, bchBalanceR, ethBalanceR)
  }
)

export const getFormValues = selectors.form.getFormValues('lockboxTransactions')
