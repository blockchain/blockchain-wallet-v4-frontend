import * as StellarSDK from 'stellar-sdk'

const TESTNET_NETWORK = 'testnet'
const PUBLIC_NETWORK = 'public'

export default ({ horizonUrl, network }) => {
  const server = new StellarSDK.Server(horizonUrl)
  if (network === TESTNET_NETWORK) StellarSDK.Network.useTestNetwork()
  else if (network === PUBLIC_NETWORK) StellarSDK.Network.usePublicNetwork()
  else {
    throw new Error(
      `invalid xlm network ${network},
      expected ${TESTNET_NETWORK} or ${PUBLIC_NETWORK}`
    )
  }

  const getXlmAccount = publicKey => server.loadAccount(publicKey)

  const pushXlmTx = tx => server.submitTransaction(tx)

  const getXlmTransactions = publicKey =>
    server
      .transactions()
      .forAccount(publicKey)
      .call()

  return {
    getXlmAccount,
    getXlmTransactions,
    pushXlmTx
  }
}
