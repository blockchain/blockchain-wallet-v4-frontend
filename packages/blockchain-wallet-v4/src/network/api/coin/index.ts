import { CoinType } from 'core/types'

export default ({ apiUrl, get, post }) => {
  const getCoinPrices = (coins, timestamp) =>
    post({
      contentType: 'application/json',
      data: coins,
      endPoint: timestamp ? `/price/index-multi?time=${timestamp}` : '/price/index-multi',
      removeDefaultPostData: true,
      url: apiUrl
    })

  const getCoinTicker = (coin: CoinType) =>
    get({
      data: { base: coin },
      endPoint: '/ticker',
      url: apiUrl
    })
  return {
    getCoinPrices,
    getCoinTicker
  }
}
