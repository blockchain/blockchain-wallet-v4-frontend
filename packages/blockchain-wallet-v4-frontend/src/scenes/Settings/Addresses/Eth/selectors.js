import { getEthBalance } from 'components/Balances/wallet/selectors'
import { selectors } from 'data'

export const getData = (state, props) => {
  const ethKvStoreSelectors = selectors.core.kvStore.eth
  const legacyEthAddr = ethKvStoreSelectors
    .getLegacyAccountAddress(state)
    .getOrElse('')

  const legacyAddressInfo = {
    addr: legacyEthAddr,
    balance: selectors.core.data.eth.getLegacyBalance(state).getOrElse(0),
    priv: state.securityCenter.shownEthPrivKey
  }

  const addressInfo = {
    addr: ethKvStoreSelectors.getContext(state).getOrElse(''),
    balance: getEthBalance(state).getOrElse(0),
    priv: state.securityCenter.shownEthPrivKey
  }

  return legacyEthAddr
    ? {
        legacyAddressInfo: legacyAddressInfo,
        addressInfo: addressInfo,
        isLegacy: true
      }
    : {
        legacyAddressInfo: null,
        addressInfo: addressInfo,
        isLegacy: false
      }
}
