import { createDeepEqualSelector } from 'services/ReselectHelper'
import {
  getLockboxBchBalance,
  getLockboxBtcBalance,
  getLockboxEthBalance,
  getLockboxXlmBalance
} from 'components/Balances/lockbox/selectors'
import { length, lift } from 'ramda'
import { selectors } from 'data'

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

export const getCoinContexts = (state, i) => ({
  btc: length(
    selectors.core.kvStore.lockbox
      .getBtcContextForDevice(state, i)
      .getOrElse([])
  ),
  bch: length(
    selectors.core.kvStore.lockbox
      .getBchContextForDevice(state, i)
      .getOrElse([])
  ),
  eth: length(
    selectors.core.kvStore.lockbox
      .getEthContextForDevice(state, i)
      .getOrElse([])
  ),
  xlm: length(
    selectors.core.kvStore.lockbox
      .getXlmContextForDevice(state, i)
      .getOrElse([])
  )
})
