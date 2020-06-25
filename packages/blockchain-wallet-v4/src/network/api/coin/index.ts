import { CoinType } from 'core/types'

export default ({ apiUrl, get }) => {
  const getCoinTicker = (coin: CoinType) =>
    get({
      url: apiUrl,
      endPoint: '/ticker',
      data: { base: coin }
    })
  return {
    getCoinTicker
  }
}
