export default ({ rootUrl, apiUrl, get, post }) => {
  const getTokenForDelegate = (data) => get({
    url: rootUrl,
    endPoint: 'wallet/signed-token',
    data: data
  })

  return {
    getTokenForDelegate
  }
}
