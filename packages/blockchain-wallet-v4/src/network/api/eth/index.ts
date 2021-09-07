import web3 from 'web3'

import { AccountTokensBalancesResponseType, EthAccountSummaryType, EthRawTxType } from './types'

const Web3 = new web3(web3.givenProvider)

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

  const getEthTicker = () =>
    get({
      data: { base: 'ETH' },
      endPoint: '/ticker',
      url: apiUrl
    })

  const pushEthTx = (rawTx) =>
    post({
      contentType: 'application/json',
      data: { rawTx },
      endPoint: '/eth/pushtx',
      url: apiUrl
    })

  const getErc20Ticker = (token) =>
    get({
      data: { base: token },
      endPoint: '/ticker',
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

  const getEthAccountSummaryV2 = (
    account,
    page?: number,
    pageSize?: number
  ): EthAccountSummaryType =>
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

  // V3
  const getEthAccountBalance = (account: string) => Web3.eth.getBalance(account)
  const getEthAccountNonce = (account: string) => Web3.eth.getTransactionCount(account)
  const getEthLatestBlock = () => Web3.eth.getBlockNumber()

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

  return {
    checkContract,
    getAccountTokensBalances,
    getErc20AccountSummaryV2,
    getErc20Ticker,
    getErc20TransactionsV2,
    getEthAccountBalance,
    getEthAccountNonce,
    getEthAccountSummaryV2,
    getEthBalances,
    getEthData,
    getEthFees,
    getEthLatestBlock,
    getEthTicker,
    getEthTransactionV2,
    getEthTransactionsV2,
    pushEthTx
  }
}
