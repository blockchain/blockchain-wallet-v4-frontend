import * as StellarSDK from 'stellar-sdk'
import { compose, head, prop } from 'ramda'

const TESTNET_NETWORK = 'testnet'
const PUBLIC_NETWORK = 'public'

export default ({ horizonUrl, network, get }) => {
  const server = new StellarSDK.Server(horizonUrl)
  if (network === TESTNET_NETWORK) StellarSDK.Network.useTestNetwork()
  else if (network === PUBLIC_NETWORK) StellarSDK.Network.usePublicNetwork()
  else {
    throw new Error(
      `invalid xlm network ${network},
      expected ${TESTNET_NETWORK} or ${PUBLIC_NETWORK}`
    )
  }
  const createXlmAccount = publicKey =>
    get({
      url: `https://friendbot.stellar.org`,
      endPoint: '',
      data: { addr: publicKey }
    })

  const getXlmAccount = publicKey => server.loadAccount(publicKey)

  const pushXlmTx = tx => server.submitTransaction(tx)

  const getXlmTransactions = ({
    publicKey,
    limit,
    latestTradeId,
    order = 'desc'
  }) => {
    const txCallBuilder = server
      .transactions()
      .forAccount(publicKey)
      .order(order)

    if (limit) txCallBuilder.limit(limit)
    if (latestTradeId) txCallBuilder.cursor(latestTradeId)

    return txCallBuilder.call().then(prop('records'))
  }

  // const getOperationsForTransaction = txId =>
  //   server
  //     .operations()
  //     .forTransaction(txId)
  //     .call()
  //     .then(prop('records'))

  // const getOperations = ({
  //   publicKey,
  //   limit,
  //   latestTradeId,
  //   order = 'desc'
  // }) => {
  //   const opCallBuilder = server
  //     .transactions()
  //     .forAccount(publicKey)
  //     .order(order)

  //   if (limit) opCallBuilder.limit(limit)
  //   if (latestTradeId) opCallBuilder.cursor(latestTradeId)

  //   return opCallBuilder.call().then(prop('records'))
  // }

  const getLatestLedgerDetails = () =>
    server
      .ledgers()
      .order('desc')
      .limit(1)
      .call()
      .then(
        compose(
          head,
          prop('records')
        )
      )

  return {
    createXlmAccount,
    getLatestLedgerDetails,
    getXlmAccount,
    getXlmTransactions,
    // getOperationsForTransaction,
    pushXlmTx
  }
}
