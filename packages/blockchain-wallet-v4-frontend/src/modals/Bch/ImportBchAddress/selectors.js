import { formValueSelector } from 'redux-form'
import { selectors } from 'data'
import Bitcoin from 'bitcoinjs-lib'

export const getData = state => {
  const priv = formValueSelector('importBchAddress')(state, 'addrOrPriv')
  const networkTypeR = selectors.core.walletOptions.getBtcNetwork(state)
  const networkType = networkTypeR.getOrElse('bitcoin')
  const network = Bitcoin.networks[networkType]
  const addresses = selectors.core.kvStore.bch.getLegacyAddrs(state).data
  return {
    priv,
    network,
    addresses
  }
}
