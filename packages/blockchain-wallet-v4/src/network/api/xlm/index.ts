import * as StellarSDK from 'stellar-sdk'
import { compose, head, prop } from 'ramda'

const TESTNET_NETWORK = 'testnet'
const PUBLIC_NETWORK = 'public'

export default ({ apiUrl, horizonUrl, network, get }) => {
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

  const getTimebounds = waitTime => server.fetchTimebounds(waitTime)

  const getXlmFees = () =>
    get({
      url: apiUrl,
      endPoint: '/mempool/fees/xlm'
    })

  const pushXlmTx = tx => server.submitTransaction(tx)

  const getXlmTransactions = ({
    publicKey,
    limit,
    pagingToken,
    reset = false,
    order = 'desc'
  }: {
    limit?: number
    order?: string
    pagingToken?: string
    publicKey: string
    reset?: boolean
  }) => {
    const txCallBuilder = server
      .transactions()
      .forAccount(publicKey)
      .order(order)

    if (pagingToken && !reset) txCallBuilder.cursor(pagingToken)
    if (limit) txCallBuilder.limit(limit)

    return txCallBuilder.call().then(prop('records'))
  }

  const getLatestLedgerDetails = () =>
    server
      .ledgers()
      .order('desc')
      .limit(1)
      .call()
      .then(
        compose(
          head,
          // @ts-ignore
          prop('records')
        )
      )

  const getXlmTicker = () =>
    get({
      url: apiUrl,
      endPoint: '/ticker',
      data: { base: 'XLM' }
    })

  return {
    createXlmAccount,
    getLatestLedgerDetails,
    getXlmAccount,
    getXlmFees,
    getXlmTransactions,
    getXlmTicker,
    getTimebounds,
    pushXlmTx
  }
}
