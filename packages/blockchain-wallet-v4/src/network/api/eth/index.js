export default ({ apiUrl, get, post }) => {
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

  return {
    checkContract,
    getEthBalances,
    getEthData,
    getEthFees,
    getEthLatestBlock,
    getEthTicker,
    getEthTransaction,
    getEthTransactions,
    pushEthTx
  }
}
