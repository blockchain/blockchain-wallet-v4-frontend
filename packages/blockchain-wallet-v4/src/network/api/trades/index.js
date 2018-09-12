export default ({ nabuUrl, post, get }) => {
  const executeTrade = (
    pair,
    quantity,
    currency,
    destinationAddress,
    refundAddress
  ) =>
    post({
      url: nabuUrl,
      endPoint: `/trades`,
      data: {
        pair,
        quantity,
        currency,
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

  return {
    executeTrade,
    fetchTrade,
    fetchTrades
  }
}
