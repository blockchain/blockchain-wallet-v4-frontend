module.exports = {
  domains: {
    api: 'https://api-testnet.blockchain.info',
    coinifyPaymentDomain: 'https://pay.sandbox.coinify.com',
    horizon: 'https://horizon-testnet.stellar.org',
    webSocket: 'wss://ws.blockchain.info/testnet3',
    root: 'https://testnet.blockchain.info',
    thePit: 'https://dev.blockchain.info'
  },
  platforms: {
    web: {
      coins: {
        BTC: {
          config: {
            network: `testnet`
          }
        }
      },
      coinify: {
        config: {
          partnerId: 35
        }
      },
      sfox: { config: { apiKey: '6fbfb80536564af8bbedb7e3be4ec439' } }
    }
  }
}
