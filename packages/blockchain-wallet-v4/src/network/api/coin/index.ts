import { CoinType } from 'core/types'

export default ({ apiUrl, get, post }) => {
  const getCoinPrices = (coins, timestamp) =>
    post({
      url: apiUrl,
      endPoint: timestamp
        ? `/price/index-multi?time=${timestamp}`
        : '/price/index-multi',
      contentType: 'application/json',
      removeDefaultPostData: true,
      data: coins
    })

  const getCoinTicker = (coin: CoinType) =>
    get({
      url: apiUrl,
      endPoint: '/ticker',
      data: { base: coin }
    })
  return {
    getCoinPrices,
    getCoinTicker
  }
}
