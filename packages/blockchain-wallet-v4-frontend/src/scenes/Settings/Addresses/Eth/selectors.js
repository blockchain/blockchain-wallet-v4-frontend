import { selectors } from 'data'

export const getData = (state) => {
  const ethKvStoreSelectors = selectors.core.kvStore.eth
  const legacyEthAddr = ethKvStoreSelectors.getLegacyAccountAddress(state).getOrElse('')

  const legacyAddressInfo = {
    addr: legacyEthAddr,
    balance: selectors.core.data.eth.getLegacyBalance(state).getOrElse(0),
    priv: state.securityCenter.shownEthLegacyPrivKey
  }

  return {
    addressInfo: {
      addr: ethKvStoreSelectors.getContext(state).getOrElse(''),
      balance: selectors.balances.getCoinTotalBalance('ETH')(state).getOrElse(0),
      priv: state.securityCenter.shownEthPrivKey
    },
    coin: 'ETH',
    isLegacy: !!legacyEthAddr,
    legacyAddressInfo: legacyEthAddr ? legacyAddressInfo : null
  }
}
