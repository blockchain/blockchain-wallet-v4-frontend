import COINIFY from 'bitcoin-coinify-client'

import { Network } from 'blockchain-wallet-v4/src'
const options = Network.Options().getWalletOptions()

export const coinifyService = {
  refresh: (value, delegate) => {
    let coinify = new COINIFY(value.data.value.coinify, delegate)
    coinify.partnerId = options.platforms.web.coinify.config.partnerId
    return coinify
  }
}
