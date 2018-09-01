export default ({ nabuUrl, post }) => {
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
        quantity,
        currency,
        destinationAddress,
        refundAddress
      },
      contentType: 'application/json',
      ignoreQueryParams: true
    })

  return {
    executeTrade
  }
}
