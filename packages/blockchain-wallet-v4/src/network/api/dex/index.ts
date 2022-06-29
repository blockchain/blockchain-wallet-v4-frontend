export default ({ apiUrl, get, post }) => {
  const getDexChains = () =>
    get({
      endPoint: `/dex-gateway/v1/chains`,
      url: apiUrl
    })

  const getDexChainTopTokens = (chainId: number) =>
    post({
      contentType: 'application/json',
      data: {
        chainId,
        queryBy: 'TOP'
      },
      endPoint: `/dex-gateway/v1/tokens`,
      removeDefaultPostData: true,
      url: apiUrl
    })

  return {
    getDexChainTopTokens,
    getDexChains
  }
}
