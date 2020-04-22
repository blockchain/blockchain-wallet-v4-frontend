import { getEthBalance } from 'components/Balances/wallet/selectors'
import { selectors } from 'data'

export const getData = (state, props) => {
  const ethKvStoreSelectors = selectors.core.kvStore.eth
  const legacyEthAddr = ethKvStoreSelectors
    .getLegacyAccountAddress(state)
    .getOrElse('')

  return legacyEthAddr
    ? {
        addr: legacyEthAddr,
        isLegacy: true,
        balance: selectors.core.data.eth.getLegacyBalance(state).getOrElse(0),
        priv: state.securityCenter.shownEthPrivKey
      }
    : {
        addr: ethKvStoreSelectors.getContext(state).getOrElse(''),
        isLegacy: false,
        balance: getEthBalance(state).getOrElse(0),
        priv: state.securityCenter.shownEthPrivKey
      }
}
