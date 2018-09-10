import { concat, curry, filter, map, sequence } from 'ramda'
import { Remote } from 'blockchain-wallet-v4/src'
import { selectors } from 'data'

export const getData = (state, ownProps) => {
  const { exclude = [], excludeLockbox } = ownProps
  const excluded = filter(x => !exclude.includes(x.label))
  const toDropdown = map(x => ({ label: x.label, value: x }))
  const toGroup = curry((label, options) => [{ label, options }])

  const getAddressesData = () => {
    return sequence(Remote.of, [
      selectors.core.common.eth
        .getAccountBalances(state)
        .map(excluded)
        .map(toDropdown)
        .map(toGroup('Wallet')),
      excludeLockbox
        ? Remote.of([])
        : selectors.core.common.eth
            .getLockboxEthBalances(state)
            .map(excluded)
            .map(toDropdown)
            .map(toGroup('Lockbox'))
    ]).map(([b1, b2]) => ({ data: concat(b1, b2) }))
  }

  return getAddressesData()
}
