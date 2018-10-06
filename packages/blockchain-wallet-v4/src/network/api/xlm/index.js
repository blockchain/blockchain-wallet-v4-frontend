import StellarSdk from 'stellar-sdk'

export default ({ networks }) => {
  const network =
    networks.xlm === 'horizon'
      ? 'https://horizon.stellar.org'
      : 'https://horizon-testnet.stellar.org'
  var server = new StellarSdk.Server(network)
  const getXlmData = context => server.loadAccount(context)

  return {
    getXlmData
  }
}
