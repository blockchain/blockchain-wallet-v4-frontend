import { UnstoppableDomainResultsType } from './types'

// eslint-disable-next-line
export default ({ apiUrl, post }) => {
  const getUnstoppableDomainResults = (): // name: string
  // currency?: string
  UnstoppableDomainResultsType => {
    // return post({
    //   url: apiUrl,
    //   contentType: 'application/json',
    //   endPoint: '/eth/v2/resolve',
    //   data: {
    //     name
    //   },
    //   removeDefaultPostData: true
    // })
    return {
      metadata: {
        type: 'CNS',
        resolver: '0xf9d051ad8b8772c0402163c69ac54cfa2a8b2f19'
      },
      results: [
        {
          currency: 'btc',
          address: 'bc155g7tt4re0uya9v0krqvq7t6r2047w3yxXXXXXX',
          ttl: 11000
        },
        {
          currency: 'eth',
          address: '0xfa2a8b2f19f9d051ad8b8772c0402163c69ac5XX',
          ttl: 11000
        }
      ]
    }
  }

  return {
    getUnstoppableDomainResults
  }
}
