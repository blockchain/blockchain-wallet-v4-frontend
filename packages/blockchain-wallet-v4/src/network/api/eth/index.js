export default ({ apiUrl, get, post }) => {
  //
  // V2
  //
  const getEthTransactionV2 = hash =>
    get({
      url: apiUrl,
      endPoint: `/v2/eth/data/transaction/${hash}`
    })

  //
  // ETH
  //
  const checkContract = address =>
    get({
      url: apiUrl,
      endPoint: `/eth/account/${address}/isContract`
    })

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

  const getEthFees = () =>
    get({
      url: apiUrl,
      endPoint: '/mempool/fees/eth'
    })

  const getEthLatestBlock = () =>
    get({
      url: apiUrl,
      endPoint: '/eth/latestblock'
    })

  const getEthTicker = () =>
    get({
      url: apiUrl,
      endPoint: '/ticker',
      data: { base: 'ETH' }
    })

  const getEthTransaction = hash =>
    get({
      url: apiUrl,
      endPoint: `/eth/tx/${hash}`
    })

  const pushEthTx = rawTx =>
    post({
      url: apiUrl,
      endPoint: '/eth/pushtx',
      contentType: 'application/json',
      data: { rawTx }
    })

  //
  // ERC20
  //
  const getErc20Ticker = token =>
    get({
      url: apiUrl,
      endPoint: '/ticker',
      data: { base: token }
    })
  const getErc20Data = (ethAddr, tokenAddr) =>
    get({
      url: apiUrl,
      endPoint: `/v2/eth/data/account/${ethAddr}/token/${tokenAddr}/wallet`
    })
  const getErc20Transactions = (ethAddr, tokenAddr, page = 0) =>
    get({
      url: apiUrl,
      endPoint: `/v2/eth/data/account/${ethAddr}/token/${tokenAddr}/wallet`,
      data: { page }
    })

  return {
    checkContract,
    getEthBalances,
    getEthData,
    getErc20Data,
    getEthFees,
    getEthLatestBlock,
    getEthTicker,
    getEthTransaction,
    getEthTransactions,
    getEthTransactionV2,
    getErc20Ticker,
    getErc20Transactions,
    pushEthTx
  }
}
