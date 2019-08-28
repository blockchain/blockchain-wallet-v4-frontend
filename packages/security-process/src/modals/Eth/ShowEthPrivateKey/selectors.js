import { selectors } from 'data'
import { getEthBalance } from 'components/Balances/wallet/selectors'

export const getData = (state, props) => {
  const ethKvStoreSelectors = selectors.core.kvStore.eth
  if (props.isLegacy) {
    const legacyAccountAddress = ethKvStoreSelectors
      .getLegacyAccountAddress(state)
      .getOrElse('')
    return {
      balance: selectors.core.data.eth.getLegacyBalance(state).getOrElse(0),
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
