import { UnstoppableDomainResultsType } from './types'

export default ({ apiUrl, post }) => {
  const getUnstoppableDomainResults = (
    name: string,
    currency?: string
  ): UnstoppableDomainResultsType => {
    return post({
      url: apiUrl,
      contentType: 'application/json',
      endPoint: '/resolve',
      data: {
        name,
        currency
      },
      removeDefaultPostData: true
    })
  }

  return {
    getUnstoppableDomainResults
  }
}
