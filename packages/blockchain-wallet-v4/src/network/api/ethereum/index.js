
export default ({ get, post }) => {
  const checkContract = (address) => ({
    url: global.domains.api,
    endPoint: `eth/account/${address}/isContract`
  })

  const getEthereumBalances = (context) => get({
    url: global.domains.api,
    endPoint: `eth/account/${Array.isArray(context) ? context.join() : context}/balance`
  })

  const getEthereumData = (context) => get({
    url: global.domains.api,
    endPoint: `eth/account/${Array.isArray(context) ? context.join() : context}`
  })

  const getEthereumFee = () => get({
    url: global.domains.api,
    endPoint: 'eth/fees'
  })

  const getEthereumLatestBlock = () => get({
    url: global.domains.api,
    endPoint: 'eth/latestblock'
  })

  const getEthereumTicker = () => get({
    url: global.domains.api,
    endPoint: 'ticker',
    data: { base: 'ETH' }
  })

  const getEthereumTransaction = (hash) => get({
    url: global.domains.api,
    endPoint: `eth/tx/${hash}`
  })

  const pushEthereumTx = (rawTx) => post({
    url: global.domains.api,
    endPoint: 'eth/pushtx',
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
    pushEthereumTx
  }
}
