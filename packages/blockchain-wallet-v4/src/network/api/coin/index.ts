import { IndexMultiResponseType } from './types'

export default ({ apiUrl, post }) => {
  const getCoinPrices = (
    coins: { base: string; quote: string }[],
    timestamp?: number
  ): IndexMultiResponseType =>
    post({
      contentType: 'application/json',
      data: coins,
      endPoint: timestamp ? `/price/index-multis?time=${timestamp}` : '/price/index-multis',
      removeDefaultPostData: true,
      url: apiUrl
    })

  return {
    getCoinPrices
  }
}
