import store from 'store'
import settings from 'config'
import { selectors } from 'data'
import { Remote } from 'blockchain-wallet-v4/src'
var fetch = require('isomorphic-fetch')

let email, walletIdentifier, sharedKey, receiveAddress

var delegate = {
  // Demo specific helper methods:
  demo: {
    setEmail: (val) => {
      email = val
    },
    setWalletIdentifier: (val) => {
      walletIdentifier = val
    },
    setSharedKey: (val) => {
      sharedKey = val
    },
    setReceiveAddress: (val) => {
      receiveAddress = val
    }
  },
  // Regular delegate methods
  save: () => {
    return Promise.resolve()
  },
  email: () => email,
  isEmailVerified: () => true,
  getToken: () => {
    console.log('Obtaining signed email token from Blockchain.info')
    let url = `https://blockchain.info/wallet/signed-token?fields=email&partner=sfox&guid=${walletIdentifier}&sharedKey=${sharedKey}`

    const processResponse = (response) => response.json()

    return fetch(url)
      .then(processResponse)
      .then((result) => result.token)
      .catch((e) => {
        console.error(e)
      })
  },
  monitorAddress: (address, callback) => {},
  checkAddress: (address) => {},
  getReceiveAddress: (trade) => {
    return receiveAddress
  },
  reserveReceiveAddress: () => {
    const state = store().store.getState()
    const getReceive = index => selectors.core.common.bitcoin.getNextAvailableReceiveAddress(settings.NETWORK_BITCOIN, index, state)
    // extract receiveAddress
    // commit the address by saving a label
    return {
      receiveAddress: receiveAddress,
      commit: () => {}
    }
  },
  releaseReceiveAddress: () => {},
  serializeExtraFields: (obj, trade) => {},
  deserializeExtraFields: (obj, trade) => {}
}

export default delegate
