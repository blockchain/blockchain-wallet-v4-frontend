import { concat, curry, filter, has, map, sequence } from 'ramda'
import { Exchange, Remote } from 'blockchain-wallet-v4/src'
import { selectors } from 'data'

export const getData = (state, ownProps) => {
  const { exclude = [], excludeLockbox } = ownProps
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
    selectors.core.common.xlm
      .getAccountBalances(state)
      .map(excluded)
      .map(toDropdown)
      .map(toGroup('Wallet')),
    excludeLockbox
      ? Remote.of([])
      : selectors.core.common.xlm
          .getLockboxXlmBalances(state)
          .map(excluded)
          .map(toDropdown)
          .map(toGroup('Lockbox'))
  ]).map(([b1, b2]) => ({ data: concat(b1, b2) }))
}
