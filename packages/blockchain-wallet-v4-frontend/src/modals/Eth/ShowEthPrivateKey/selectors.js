import { selectors } from 'data'
import { getEthBalance } from 'components/Balances/wallet/selectors'

export const getData = (state, props) => {
  const ethKvStoreSelectors = selectors.core.kvStore.ethereum
  if (props.isLegacy) {
    const legacyAccountAddress = ethKvStoreSelectors
      .getLegacyAccountAddress(state)
      .getOrElse('')
    return {
      balance: selectors.core.data.ethereum
        .getLegacyBalance(state)
        .getOrElse(0),
      addr: legacyAccountAddress,
      priv: state.securityCenter.shownEthPrivKey
    }
  } else {
    return {
      balance: getEthBalance(state).getOrElse(0),
      addr: ethKvStoreSelectors.getContext(state).getOrElse(''),
      priv: state.securityCenter.shownEthPrivKey
    }
  }
}
