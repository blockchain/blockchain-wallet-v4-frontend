export default ({ shapeShiftApiKey, get, post }) => {
  const url = 'https://shapeshift.io/'
  const getPair = pair =>
    get({
      url,
      endPoint: `marketinfo/${pair}`,
      contentType: 'application/json'
    })

  const getTradeStatus = address =>
    get({
      url,
      endPoint: `txStat/${address}`,
      contentType: 'application/json'
    })

  const createQuote = (amount, pair, isDeposit) =>
    isDeposit
      ? post({
          url,
          endPoint: 'sendamount',
          contentType: 'application/json',
          data: {
            apiKey: shapeShiftApiKey,
            depositAmount: amount,
            pair
          }
        })
      : post({
          url,
          endPoint: 'sendamount',
          contentType: 'application/json',
          data: {
            apiKey: shapeShiftApiKey,
            withdrawalAmount: amount,
            pair
          }
        })

  const createOrder = (depositAmount, pair, returnAddress, withdrawal) =>
    post({
      url,
      endPoint: 'sendamount',
      contentType: 'application/json',
      data: {
        apiKey: shapeShiftApiKey,
        depositAmount,
        pair,
        returnAddress,
        withdrawal
      }
    })

  return {
    getPair,
    getTradeStatus,
    createQuote,
    createOrder
  }
}
