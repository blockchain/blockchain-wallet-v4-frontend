export default ({ nabuUrl, post, get }) => {
  const executeTrade = (quote, refundAddress, destinationAddress) =>
    post({
      url: nabuUrl,
      endPoint: `/trades`,
      data: {
        quote,
        destinationAddress,
        refundAddress
      },
      contentType: 'application/json',
      ignoreQueryParams: true
    })

  const fetchTrade = id =>
    get({
      url: nabuUrl,
      endPoint: `/trades/${id}`,
      contentType: 'application/json',
      ignoreQueryParams: true
    })

  const fetchTrades = (limit, before = null) => {
    const data = { limit }
    if (before) data.before = before
    return get({
      url: nabuUrl,
      endPoint: '/trades',
      data,
      contentType: 'application/json',
      ignoreQueryParams: true
    })
  }

  const fetchLimits = currency =>
    get({
      url: nabuUrl,
      endPoint: `/trades/limits?currency=${currency}`,
      contentType: 'application/json',
      ignoreQueryParams: true
    })

  return {
    executeTrade,
    fetchLimits,
    fetchTrade,
    fetchTrades
  }
}
