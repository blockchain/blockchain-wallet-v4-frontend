
export default ({ rootUrl, apiUrl, get, post }) => {
  const fetchEtherBalances = (addresses) => get({
    url: apiUrl,
    endPoint: `eth/account/${Array.isArray(addresses) ? addresses.join() : addresses}/balance`
  })

  const fetchEthereumData = (context) => get({
    url: apiUrl,
    endPoint: `eth/account/${Array.isArray(context) ? context.join() : context}`
  })

  return {
    fetchEtherBalances,
    fetchEthereumData
  }
}
