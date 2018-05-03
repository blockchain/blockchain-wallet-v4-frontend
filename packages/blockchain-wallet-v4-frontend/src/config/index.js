import Bitcoin from 'bitcoinjs-lib'
import BitcoinCash from 'bitcoinforksjs-lib'

export default {
  WALLET_DATA_PATH: 'wallet.data',
  WALLET_PAYLOAD_PATH: 'wallet.payload',
  WALLET_SETTINGS_PATH: 'wallet.settings',
  WALLET_OPTIONS_PATH: 'wallet.options',
  WALLET_KVSTORE_PATH: 'wallet.kvstore',
  NETWORK: Bitcoin.networks.bitcoin,
  NETWORK_ETHEREUM: 1,
  NETWORK_BCH: BitcoinCash.networks.bitcoin
}
