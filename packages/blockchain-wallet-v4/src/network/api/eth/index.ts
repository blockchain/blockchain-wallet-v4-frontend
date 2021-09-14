import { AccountTokensBalancesResponseType, EthRawTxType } from './types'

export default ({ apiUrl, get, post }) => {
  //
  // Misc
  //
  const checkContract = (address) =>
    get({
      endPoint: `/eth/account/${address}/isContract`,
      url: apiUrl
    })

  const getEthFees = (contractAddress) => {
    const baseUrl = '/mempool/fees/eth'
    return get({
      endPoint: contractAddress ? `${baseUrl}?contractAddress=${contractAddress}` : baseUrl,
      ignoreQueryParams: true,
      url: apiUrl
    })
  }

  const pushEthTx = (rawTx) =>
    post({
      contentType: 'application/json',
      data: { rawTx },
      endPoint: '/eth/pushtx',
      url: apiUrl
    })

  //
  // V2
  //
  const getEthTransactionV2 = (hash): EthRawTxType =>
    get({
      endPoint: `/v2/eth/data/transaction/${hash}`,
      url: apiUrl
    })

  const getEthTransactionsV2 = (
    account,
    page,
    pageSize
  ): {
    page: string
    size: number
    transactions: Array<EthRawTxType>
  } =>
    get({
      data: { page, size: pageSize },
      endPoint: `/v2/eth/data/account/${account}/transactions`,
      url: apiUrl
    })

  const getEthAccountSummaryV2 = (account, page, pageSize) =>
    get({
      data: { page, size: pageSize },
      endPoint: `/v2/eth/data/account/${account}/wallet`,
      url: apiUrl
    })

  const getAccountTokensBalances = (ethAddr): AccountTokensBalancesResponseType =>
    get({
      endPoint: `/eth/v2/account/${ethAddr}/tokens`,
      url: apiUrl
    })

  const getErc20AccountSummaryV2 = (ethAddr, tokenAddr, page = 0, pageSize?: number) =>
    get({
      data: { page, size: pageSize },
      endPoint: `/v2/eth/data/account/${ethAddr}/token/${tokenAddr}/wallet`,
      url: apiUrl
    })

  const getErc20TransactionsV2 = (ethAddr, tokenAddr, page = 0, pageSize) =>
    get({
      data: { page, size: pageSize },
      endPoint: `/v2/eth/data/account/${ethAddr}/token/${tokenAddr}/transfers`,
      url: apiUrl
    })

  //
  // LEGACY ETH ENDPOINTS
  // TODO: update to v2 endpoints, deprecate these
  //
  const getEthBalances = (context) =>
    get({
      endPoint: `/eth/account/${Array.isArray(context) ? context.join(',') : context}/balance`,
      url: apiUrl
    })

  const getEthData = (context) =>
    get({
      endPoint: `/eth/account/${Array.isArray(context) ? context.join(',') : context}`,
      url: apiUrl
    })

  const getEthTransactions = (context, page = 0) =>
    get({
      data: { page },
      endPoint: `/eth/account/${Array.isArray(context) ? context.join(',') : context}`,
      url: apiUrl
    })

  const getEthLatestBlock = () =>
    get({
      endPoint: '/eth/latestblock',
      url: apiUrl
    })

  const getEthTransaction = (hash) =>
    get({
      endPoint: `/eth/tx/${hash}`,
      url: apiUrl
    })

  return {
    checkContract,
    getAccountTokensBalances,
    getErc20AccountSummaryV2,
    getErc20TransactionsV2,
    getEthAccountSummaryV2,
    getEthBalances,
    getEthData,
    getEthFees,
    getEthLatestBlock,
    getEthTransaction,
    getEthTransactionV2,
    getEthTransactions,
    getEthTransactionsV2,
    pushEthTx
  }
}
