export default ({ get }) => {
  const url = 'https://shapeshift.io/'

  const getTradeStatus = address =>
    get({
      url,
      endPoint: `txStat/${address}`,
      contentType: 'application/json'
    })

  return {
    getTradeStatus
  }
}
