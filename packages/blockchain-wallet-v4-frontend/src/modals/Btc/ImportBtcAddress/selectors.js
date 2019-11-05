import * as Bitcoin from 'bitcoinjs-lib'
import { formValueSelector } from 'redux-form'
import { selectors } from 'data'

export const getData = state => {
  const addressType = formValueSelector('importBtcAddress')(
    state,
    'address-type'
  )
  const priv = formValueSelector('importBtcAddress')(state, 'addrOrPriv')
  const networkTypeR = selectors.core.walletOptions.getBtcNetwork(state)
  const networkType = networkTypeR.getOrElse('bitcoin')
  const network = Bitcoin.networks[networkType]

  return {
    priv,
    network,
    isAddressInternal: addressType === 'internal',
    isAddressExternal: addressType === 'external'
  }
}
