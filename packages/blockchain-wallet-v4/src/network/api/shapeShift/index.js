export default ({ shapeShiftRootUrl, get, post }) => {
  const getBtcEth = () => get({
    url: shapeShiftRootUrl,
    endPoint: `marketinfo/btc_eth`
  })

  const getEthBtc = () => get({
    url: shapeShiftRootUrl,
    endPoint: `marketinfo/eth_btc`
  })

  return {
    getBtcEth,
    getEthBtc
  }
}
