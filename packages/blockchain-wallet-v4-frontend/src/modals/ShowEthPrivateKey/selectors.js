import { selectors } from 'data'

export const getData = (state, props) => {
  const ethKvStoreSelectors = selectors.core.kvStore.ethereum
  return {
    balance: props.isLegacy ? 0 : selectors.core.data.ethereum.getBalance(state).getOrElse(0),
    addr: (props.isLegacy
      ? ethKvStoreSelectors.getLegacyAccountAddress(state)
      : ethKvStoreSelectors.getContext(state)).getOrElse(''),
    priv: state.securityCenter.shownEthPrivKey
  }
}
