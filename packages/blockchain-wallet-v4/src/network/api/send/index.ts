import { UnstoppableDomainResultsType } from './types'

export default ({ apiUrl, post }) => {
  const getUnstoppableDomainResults = (
    name: string,
    currency?: string
  ): UnstoppableDomainResultsType => {
    return post({
      contentType: 'application/json',
      data: {
        currency,
        name
      },
      endPoint: '/resolve',
      removeDefaultPostData: true,
      url: apiUrl
    })
  }

  return {
    getUnstoppableDomainResults
  }
}
