import * as StellarSDK from 'stellar-sdk'
import { compose, head, prop } from 'ramda'

export default ({ apiUrl, horizonUrl, get }) => {
  const server = new StellarSDK.Server(horizonUrl)
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
    order?: 'asc' | 'desc'
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
