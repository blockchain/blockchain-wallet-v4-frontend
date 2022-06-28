export default ({ apiUrl, get }) => {
  const getDexChains = () =>
    get({
      endPoint: `/dex-gateway/v1/chains`,
      url: apiUrl
    })

  return {
    getDexChains
  }
}
