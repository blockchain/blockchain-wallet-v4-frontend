import Bitcoin from 'bitcoinjs-lib'
import BitcoinCash from 'bitcoinforksjs-lib'

const isTestnet = false

export default {
  WALLET_DATA_PATH: 'wallet.data',
  WALLET_PAYLOAD_PATH: 'wallet.payload',
  WALLET_SETTINGS_PATH: 'wallet.settings',
  WALLET_OPTIONS_PATH: 'wallet.options',
  WALLET_KVSTORE_PATH: 'wallet.kvstore',
  NETWORK_BTC: Bitcoin.networks[isTestnet ? 'testnet' : 'bitcoin'],
  NETWORK_ETH: 1,
  NETWORK_BCH: BitcoinCash.networks[isTestnet ? 'testnet' : 'bitcoin']
}
