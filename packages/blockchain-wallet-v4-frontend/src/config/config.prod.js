import Bitcoin from 'bitcoinjs-lib'

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
  NETWORK: Bitcoin.networks.bitcoin
}
