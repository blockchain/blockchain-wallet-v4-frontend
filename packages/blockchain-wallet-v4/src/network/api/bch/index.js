
export default ({ rootUrl, apiUrl, get, post }) => {
  const getBchTicker = () => get({
    url: rootUrl,
    endPoint: 'ticker',
    data: { format: 'json', base: 'BCH' }
  })

  return {
    getBchTicker
  }
}
