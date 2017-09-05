
import Bitcoin from 'bitcoinjs-lib'

// ======================== LIVE ============================

export default {
  ROOT_URL: 'https://blockchain.info/',
  API_BLOCKCHAIN_INFO: 'https://api.blockchain.info/',
  API_CODE: '1770d5d9-bcea-4d28-ad21-6cbd5be018a8',
  WEB_SOCKET_URL: 'wss://ws.blockchain.info/inv',
  BLOCKCHAIN_DATA_PATH: 'data',
  WALLET_IMMUTABLE_PATH: 'payload',
  SETTINGS_PATH: 'settings',
  NETWORK: Bitcoin.networks.bitcoin
}

// ======================= TESTNET ==========================

// export default {
//   ROOT_URL: 'https://testnet5.blockchain.info/',
//   API_BLOCKCHAIN_INFO: 'https://api.testnet.blockchain.info/',
//   API_CODE: '1770d5d9-bcea-4d28-ad21-6cbd5be018a8',
//   WEB_SOCKET_URL: 'wss://ws.testnet.blockchain.info/inv',
//   BLOCKCHAIN_DATA_PATH: 'data',
//   WALLET_IMMUTABLE_PATH: 'payload',
//   SETTINGS_PATH: 'settings',
//   NETWORK: Bitcoin.networks.testnet
// }

// ======================= STAGING ==========================

// export default {
//   ROOT_URL: 'https://explorer.staging.blockchain.info/',
//   API_BLOCKCHAIN_INFO: 'https://api.staging.blockchain.info/',
//   API_CODE: '1770d5d9-bcea-4d28-ad21-6cbd5be018a8',
//   BLOCKCHAIN_DATA_PATH: 'data',
//   WALLET_IMMUTABLE_PATH: 'payload',
//   SETTINGS_PATH: 'settings',
//   NETWORK: Bitcoin.networks.bitcoin
// }
