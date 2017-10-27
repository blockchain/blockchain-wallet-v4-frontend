
export default ({ rootUrl, apiUrl, get, post }) => {
  const getEtherBalances = (context) => get({
    url: apiUrl,
    endPoint: `eth/account/${Array.isArray(context) ? context.join() : context}/balance`
  })

  const getEthereumData = (context) => get({
    url: apiUrl,
    endPoint: `eth/account/${Array.isArray(context) ? context.join() : context}`
  })

  const getEthereumFee = () => get({
    url: apiUrl,
    endPoint: 'eth/fees'
  })

  const getEthereumLatestBlock = () => ({
    url: apiUrl,
    endPoint: 'eth/latestBlock'
  })

  const getEthereumTicker = () => get({
    url: rootUrl,
    endPoint: 'ticker',
    data: { format: 'json', currency: 'USD', base: 'ETH' }
  })

  const pushTx = (tx) => post({
    url: apiUrl,
    endPoint: 'eth/pushtx',
    contentType: 'application/json',
    data: JSON.stringify(tx)
  })

  return {
    getEtherBalances,
    getEthereumData,
    getEthereumFee,
    getEthereumLatestBlock,
    getEthereumTicker,
    pushTx
  }
}
