import * as ethers from 'ethers'

import { AccountTokensBalancesResponseType, EthAccountSummaryType, EthRawTxType } from './types'

export default ({ apiUrl, get, post }) => {
  //
  // Deprecate
  //

  const ethProvider = ethers.providers.getDefaultProvider(`${apiUrl}/eth/nodes/rpc`)

  // web3.eth.getBalance
  const getEthBalances = (context) =>
    get({
      endPoint: `/eth/account/${Array.isArray(context) ? context.join(',') : context}/balance`,
      url: apiUrl
    })

  // https://docs.ethers.io/v5/api/providers/provider/#Provider-getCode
  const checkContract = (address) =>
    get({
      endPoint: `/eth/account/${address}/isContract`,
      url: apiUrl
    })

  // https://docs.ethers.io/v5/api/providers/provider/#Provider-getGasPrice
  const getEthFees = (contractAddress) => {
    const baseUrl = '/mempool/fees/eth'
    return get({
      endPoint: contractAddress ? `${baseUrl}?contractAddress=${contractAddress}` : baseUrl,
      ignoreQueryParams: true,
      url: apiUrl
    })
  }

  // https://docs.ethers.io/v5/api/providers/provider/#Provider-sendTransaction
  const pushEthTx = (rawTx) =>
    post({
      contentType: 'application/json',
      data: { rawTx },
      endPoint: '/eth/pushtx',
      url: apiUrl
    })

  //
  // Transactions and Erc20 Balance
  // TODO: @sean
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
  const getEthAccountBalance = (account: string) => ethProvider.getBalance(account)
  const getEthAccountNonce = (account: string) => ethProvider.getTransactionCount(account)
  const getEthLatestBlock = () => ethProvider.getBlockNumber()
  const getEthGasPrice = () => ethProvider.getGasPrice()

  return {
    checkContract,
    ethProvider,
    getAccountTokensBalances,
    getErc20AccountSummaryV2,
    getErc20TransactionsV2,
    getEthAccountBalance,
    getEthAccountNonce,
    getEthAccountSummaryV2,
    getEthBalances,
    getEthFees,
    getEthGasPrice,
    getEthLatestBlock,
    getEthTransactionV2,
    getEthTransactionsV2,
    pushEthTx
  }
}
