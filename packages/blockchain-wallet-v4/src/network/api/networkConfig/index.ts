import { NetworkConfig } from 'data/networkConfig/types'

export default ({ apiUrl, authorizedGet }) => {
  const getNetworkConfig = (): NetworkConfig =>
    authorizedGet({
      contentType: 'application/json',
      endPoint: '/network-config/',
      ignoreQueryParams: true,
      url: apiUrl
    })

  return {
    getNetworkConfig
  }
}
