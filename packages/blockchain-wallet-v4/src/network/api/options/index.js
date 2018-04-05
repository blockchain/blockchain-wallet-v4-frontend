export default ({ rootUrl, get }) => {
  const getWalletOptions = () => get({
    url: rootUrl,
    endPoint: 'Resources/wallet-options.json'
  })

  return {
    getWalletOptions
  }
}
