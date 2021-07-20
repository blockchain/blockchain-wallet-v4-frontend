import * as Bitcoin from 'bitcoinjs-lib'
import { formValueSelector } from 'redux-form'

export const getData = (state) => {
  const priv = formValueSelector('importBtcAddress')(state, 'addrOrPriv')
  const networkType = 'bitcoin'
  const network = Bitcoin.networks[networkType]

  return {
    network,
    priv
  }
}

export default getData
