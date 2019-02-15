import { concat, curry, filter, has, map, sequence } from 'ramda'
import { Exchange, Remote } from 'blockchain-wallet-v4/src'
import { selectors } from 'data'
import { createDeepEqualSelector } from 'services/ReselectHelper'

export const getData = createDeepEqualSelector(
  [
    selectors.core.common.xlm.getAccountBalances,
    selectors.core.common.xlm.getLockboxXlmBalances,
    (state, { exclude }) => exclude,
    (state, { excludeLockbox }) => excludeLockbox
  ],
  (walletBalances, lockboxBalances, exclude = [], excludeLockbox) => {
    const buildDisplay = wallet => {
      if (has('balance', wallet)) {
        let xlmDisplay = Exchange.displayXlmToXlm({
          value: wallet.balance,
          fromUnit: 'STROOP',
          toUnit: 'XLM'
        })
        return wallet.label + ` (${xlmDisplay})`
      }
      return wallet.label
    }
    const excluded = filter(x => !exclude.includes(x.label))
    const toDropdown = map(x => ({ label: buildDisplay(x), value: x }))
    const toGroup = curry((label, options) => [{ label, options }])

    return sequence(Remote.of, [
      walletBalances
        .map(excluded)
        .map(toDropdown)
        .map(toGroup('Wallet')),
      excludeLockbox
        ? Remote.of([])
        : lockboxBalances
            .map(excluded)
            .map(toDropdown)
            .map(toGroup('Lockbox'))
    ]).map(([b1, b2]) => ({ data: concat(b1, b2) }))
  }
)
