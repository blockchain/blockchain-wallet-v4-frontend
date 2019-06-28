export default ({ coinifyUrl, get }) => {
  const getCoinifyStates = () =>
    get({
      url: coinifyUrl,
      endPoint: '/countries/70c76011-2b52-400e-8344-272e196b2fad'
    })

  return {
    getCoinifyStates
  }
}
