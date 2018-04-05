export default ({ rootUrl, get }) => {
  const getWalletOptions = () => get({
    url: '/',
    endPoint: 'Resources/wallet-options.json'
  })

  return {
    getWalletOptions
  }
}
