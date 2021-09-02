import { IndexMultiResponseType } from './types'

export default ({ apiUrl, post }) => {
  const getCoinPrices = (
    coins: { base: string; quote: string }[],
    timestamp?: number
  ): IndexMultiResponseType =>
    post({
      contentType: 'application/json',
      data: coins,
      endPoint: timestamp ? `/price/index-mults?time=${timestamp}` : '/price/index-mults',
      removeDefaultPostData: true,
      url: apiUrl
    })

  return {
    getCoinPrices
  }
}
