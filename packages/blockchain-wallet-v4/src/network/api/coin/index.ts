import moment from 'moment'

export default ({ apiUrl, get, post }) => {
  const getCoinPrices = (coins, timestamp) =>
    post({
      contentType: 'application/json',
      data: coins,
      endPoint: timestamp ? `/price/index-multi?time=${timestamp}` : '/price/index-multi',
      removeDefaultPostData: true,
      url: apiUrl
    })

  const getCoinTicker = async (base: string, quote: string) => {
    const index = await get({
      data: { base, quote, time: moment().unix() },
      endPoint: '/price/index',
      url: apiUrl
    })

    return index.price
  }
  return {
    getCoinPrices,
    getCoinTicker
  }
}
