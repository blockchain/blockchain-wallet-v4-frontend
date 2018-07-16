
export default ({ rootUrl, apiUrl, get, post }) => {
  const checkContract = (address) => ({
    url: apiUrl,
    endPoint: `/eth/account/${address}/isContract`
  })

  const getEthereumBalances = (context) => get({
    url: apiUrl,
    endPoint: `/eth/account/${Array.isArray(context) ? context.join() : context}/balance`
  })

  const getEthereumData = (context) => get({
    url: apiUrl,
    endPoint: `/eth/account/${Array.isArray(context) ? context.join() : context}`
  })

  const getEthereumFee = () => get({
    url: apiUrl,
    endPoint: '/eth/fees'
  })

  const getEthereumLatestBlock = () => get({
    url: apiUrl,
    endPoint: '/eth/latestblock'
  })

  const getEthereumTicker = () => get({
    url: apiUrl,
    endPoint: '/ticker',
    data: { base: 'ETH' }
  })

  const getEthereumTransaction = (hash) => get({
    url: apiUrl,
    endPoint: `/eth/tx/${hash}`
  })

  const getEthereumTransactions = (account, page = 0) => get({
    url: apiUrl,
    endPoint: `/eth/account/${account}`,
    data: { page }
  })

  const pushEthereumTx = (rawTx) => post({
    url: apiUrl,
    endPoint: '/eth/pushtx',
    contentType: 'application/json',
    data: { rawTx }
  })

  return {
    checkContract,
    getEthereumBalances,
    getEthereumData,
    getEthereumFee,
    getEthereumLatestBlock,
    getEthereumTicker,
    getEthereumTransaction,
    getEthereumTransactions,
    pushEthereumTx
  }
}
