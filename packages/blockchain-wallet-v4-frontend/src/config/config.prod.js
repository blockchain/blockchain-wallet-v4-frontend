import Bitcoin from 'bitcoinjs-lib'
import BitcoinCash from 'bitcoinforksjs-lib'

export default {
  ROOT_URL: 'https://blockchain.info/',
  API_BLOCKCHAIN_INFO: 'https://api.blockchain.info/',
  API_CODE: '1770d5d9-bcea-4d28-ad21-6cbd5be018a8',
  WEB_SOCKET_URL: 'wss://ws.blockchain.info/inv',
  WALLET_DATA_PATH: 'wallet.data',
  WALLET_PAYLOAD_PATH: 'wallet.payload',
  WALLET_SETTINGS_PATH: 'wallet.settings',
  WALLET_OPTIONS_PATH: 'wallet.options',
  WALLET_KVSTORE_PATH: 'wallet.kvstore',
  SHAPESHIFT_ROOT_URL: 'https://shapeshift.io/',
  SHAPESHIFT_API_KEY: 'b7a7c320c19ea3a8e276c8921bc3ff79ec064d2cd9d98ab969acc648246b4be5ab2379af704c5d3a3021c0ddf82b3e479590718847c1301e1a85331d2d2a8370',
  NETWORK: Bitcoin.networks.bitcoin,
  NETWORK_ETHEREUM: 1,
  NETWORK_BCH: BitcoinCash.networks.bitcoin
}
