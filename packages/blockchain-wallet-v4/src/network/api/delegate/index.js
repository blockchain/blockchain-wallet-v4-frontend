export default ({ get, post }) => {
  const getTokenForDelegate = (data) => get({
    url: global.domains.root,
    endPoint: 'wallet/signed-token',
    data: data
  })

  return {
    getTokenForDelegate
  }
}
