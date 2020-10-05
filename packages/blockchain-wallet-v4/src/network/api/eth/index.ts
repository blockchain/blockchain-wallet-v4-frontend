import {
  RawErc20TxResponseType,
  RawEthTxResponseType,
  RawEthTxType
} from './types'

export default ({ apiUrl, get, post }) => {
  //
  // Misc
  //
  const checkContract = address =>
    get({
      url: apiUrl,
      endPoint: `/eth/account/${address}/isContract`
    })

  const getEthFees = () =>
    get({
      url: apiUrl,
      endPoint: '/mempool/fees/eth'
    })

  const getEthTicker = () =>
    get({
      url: apiUrl,
      endPoint: '/ticker',
      data: { base: 'ETH' }
    })

  const pushEthTx = rawTx =>
    post({
      url: apiUrl,
      endPoint: '/eth/pushtx',
      contentType: 'application/json',
      data: { rawTx }
    })

  const getErc20Ticker = token =>
    get({
      url: apiUrl,
      endPoint: '/ticker',
      data: { base: token }
    })

  //
  // V2
  //
  const getEthTransactionV2 = (hash): RawEthTxType =>
    get({
      url: apiUrl,
      endPoint: `/v2/eth/data/transaction/${hash}`
    })

  const getEthTransactionsV2 = (
    account: string,
    page: number,
    pageSize: number
  ): RawEthTxResponseType =>
    get({
      url: apiUrl,
      endPoint: `/v2/eth/data/account/${account}/transactions`,
      data: { page, size: pageSize }
    })

  const getEthAccountSummaryV2 = (account, page, pageSize) =>
    get({
      url: apiUrl,
      endPoint: `/v2/eth/data/account/${account}/wallet`,
      data: { page, size: pageSize }
    })

  const getErc20AccountSummaryV2 = (ethAddr, tokenAddr, page = 0, pageSize) =>
    get({
      url: apiUrl,
      endPoint: `/v2/eth/data/account/${ethAddr}/token/${tokenAddr}/wallet`,
      data: { page, size: pageSize }
    })

  const getErc20TransactionsV2 = (
    ethAddr: string,
    tokenAddr: string,
    page: number = 0,
    pageSize: number
  ): RawErc20TxResponseType =>
    get({
      url: apiUrl,
      endPoint: `/v2/eth/data/account/${ethAddr}/token/${tokenAddr}/transfers`,
      data: { page, size: pageSize }
    })

  //
  // LEGACY ETH ENDPOINTS
  // TODO: update to v2 endpoints, deprecate these
  //
  const getEthBalances = context =>
    get({
      url: apiUrl,
      endPoint: `/eth/account/${
        Array.isArray(context) ? context.join(',') : context
      }/balance`
    })

  const getEthData = context =>
    get({
      url: apiUrl,
      endPoint: `/eth/account/${
        Array.isArray(context) ? context.join(',') : context
      }`
    })

  const getEthTransactions = (context, page = 0) =>
    get({
      url: apiUrl,
      endPoint: `/eth/account/${
        Array.isArray(context) ? context.join(',') : context
      }`,
      data: { page }
    })

  const getEthLatestBlock = () =>
    get({
      url: apiUrl,
      endPoint: '/eth/latestblock'
    })

  const getEthTransaction = hash =>
    get({
      url: apiUrl,
      endPoint: `/eth/tx/${hash}`
    })

  return {
    checkContract,
    getEthAccountSummaryV2,
    getEthBalances,
    getEthData,
    getEthFees,
    getEthLatestBlock,
    getEthTicker,
    getEthTransaction,
    getEthTransactions,
    getEthTransactionV2,
    getEthTransactionsV2,
    getErc20AccountSummaryV2,
    getErc20Ticker,
    getErc20TransactionsV2,
    pushEthTx
  }
}
