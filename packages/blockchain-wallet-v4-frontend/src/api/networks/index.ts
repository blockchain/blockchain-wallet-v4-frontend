import BitcoinCash from 'bitcoinforksjs-lib'
import * as Bitcoin from 'bitcoinjs-lib'

export const makeNetworks = () => ({
  bch: BitcoinCash.networks.bitcoin,
  btc: Bitcoin.networks.bitcoin,
  eth: 1,
  xlm: 'public'
})
