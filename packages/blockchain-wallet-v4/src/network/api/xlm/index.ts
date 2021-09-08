import { compose, head, prop } from 'ramda'
import * as StellarSDK from 'stellar-sdk'

export default ({ apiUrl, get, horizonUrl }) => {
  const server = new StellarSDK.Server(horizonUrl)
  const createXlmAccount = (publicKey) =>
    get({
      data: { addr: publicKey },
      endPoint: '',
      url: `https://friendbot.stellar.org`
    })

  const getXlmAccount = (publicKey) => server.loadAccount(publicKey)

  const getTimebounds = (waitTime) => server.fetchTimebounds(waitTime)

  const getXlmFees = () =>
    get({
      endPoint: '/mempool/fees/xlm',
      url: apiUrl
    })

  const pushXlmTx = (tx) => server.submitTransaction(tx)

  const getXlmTransactions = ({
    limit,
    order = 'desc',
    pagingToken,
    publicKey,
    reset = false
  }: {
    limit?: number
    order?: 'asc' | 'desc'
    pagingToken?: string
    publicKey: string
    reset?: boolean
  }) => {
    const txCallBuilder = server.transactions().forAccount(publicKey).order(order)

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

  return {
    createXlmAccount,
    getLatestLedgerDetails,
    getTimebounds,
    getXlmAccount,
    getXlmFees,
    getXlmTransactions,
    pushXlmTx
  }
}
