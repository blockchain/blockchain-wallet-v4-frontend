
export default ({ rootUrl, apiUrl, get, post }) => {
  const checkContract = (address) => ({
    url: apiUrl,
    endPoint: `eth/account/${address}/isContract`
  })

  const getEthereumBalances = (context) => get({
    url: apiUrl,
    endPoint: `eth/account/${Array.isArray(context) ? context.join() : context}/balance`
  })

  const getEthereumData = (context, page = 1) => get({
    url: apiUrl,
    endPoint: `eth/account/${Array.isArray(context) ? context.join() : context}`
  })

  const getEthereumFee = () => get({
    url: apiUrl,
    endPoint: 'eth/fees'
  })

  const getEthereumLatestBlock = () => get({
    url: apiUrl,
    endPoint: 'eth/latestblock'
  })

  const getEthereumTicker = () => get({
    url: rootUrl,
    endPoint: 'ticker',
    data: { format: 'json', base: 'ETH' }
  })

  const getEthereumTransaction = (hash) => get({
    url: apiUrl,
    endPoint: `eth/tx/${hash}`
  })

  const pushEthereumTx = (rawTx) => post({
    url: apiUrl,
    endPoint: 'eth/pushtx',
    contentType: 'application/json',
    data: JSON.stringify({ rawTx })
  })

  return {
    checkContract,
    getEthereumBalances,
    getEthereumData,
    getEthereumFee,
    getEthereumLatestBlock,
    getEthereumTicker,
    getEthereumTransaction,
    pushEthereumTx
  }
}
