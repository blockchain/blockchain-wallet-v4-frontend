import { concat, filter, map, sequence, reduce } from 'ramda'
import { Remote } from 'blockchain-wallet-v4/src'
import { selectors } from 'data'

export const getData = (state, ownProps) => {
  const { exclude = [], excludeImported, excludeLockbox } = ownProps
  const excluded = filter(x => !exclude.includes(x.label))
  const toDropdown = map(x => ({ text: x.label, value: x }))

  const getAddressesData = () => {
    return sequence(Remote.of, [
      selectors.core.common.btc
        .getActiveAccountsBalances(state)
        .map(excluded)
        .map(toDropdown),
      excludeImported
        ? Remote.of([])
        : selectors.core.common.btc.getAddressesBalances(state).map(toDropdown),
      excludeLockbox
        ? Remote.of([])
        : selectors.core.common.btc
            .getLockboxBtcBalances(state)
            .map(excluded)
            .map(toDropdown)
    ]).map(([b1, b2, b3]) => ({ data: reduce(concat, [], [b1, b2, b3]) }))
  }

  return getAddressesData()
}
