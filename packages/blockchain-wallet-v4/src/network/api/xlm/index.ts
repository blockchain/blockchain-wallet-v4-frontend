import { compose, head, prop } from 'ramda'
import { Server } from 'stellar-sdk'

export default ({ apiUrl, get, horizonUrl }) => {
  const server = new Server(horizonUrl)

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
    getLatestLedgerDetails,
    getTimebounds,
    getXlmAccount,
    getXlmFees,
    getXlmTransactions,
    pushXlmTx
  }
}
