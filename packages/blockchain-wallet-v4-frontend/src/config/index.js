import Bitcoin from 'bitcoinjs-lib'

export default {
  ROOT_URL: process.env.BLOCKCHAIN_INFO,
  API_URL: process.env.API_BLOCKCHAIN_INFO,
  API_CODE: '1770d5d9-bcea-4d28-ad21-6cbd5be018a8',
  WEB_SOCKET_URL: process.env.WEB_SOCKET_URL,
  WALLET_PAYLOAD_PATH: 'wallet.payload',
  WALLET_KVSTORE_PATH: 'wallet.kvstore',
  SHAPESHIFT_ROOT_URL: 'https://shapeshift.io/',
  SHAPESHIFT_API_KEY: 'b7a7c320c19ea3a8e276c8921bc3ff79ec064d2cd9d98ab969acc648246b4be5ab2379af704c5d3a3021c0ddf82b3e479590718847c1301e1a85331d2d2a8370',
  NETWORK_BITCOIN: Bitcoin.networks.bitcoin,
  NETWORK_ETHEREUM: 1 // MAINNET
}
