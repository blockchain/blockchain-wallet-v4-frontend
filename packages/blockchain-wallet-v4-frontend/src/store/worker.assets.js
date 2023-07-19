/* eslint-disable */

// utility to parse result from promise
const parsePromiseResponse = (res) => (res.ok ? res.json() : Promise.resolve({}))

// main function to fetch and manipulate application coin config
addEventListener('message', ({ data }) => {
  const { assetApi, openSeaApi } = JSON.parse(data)

  // fetch custodial/erc20 assets
  const custodialAssets = fetch(`${assetApi}/assets/currencies/custodial`).then(
    parsePromiseResponse
  )
  const erc20Assets = fetch(`${assetApi}/assets/currencies/erc20`).then(parsePromiseResponse)

  Promise.all([custodialAssets, erc20Assets]).then(([custodialAssets, erc20Assets]) => {
    try {
      let assets = {}
      const supportedCoins = custodialAssets.currencies.concat(erc20Assets.currencies)

      supportedCoins.forEach((coin) => {
        assets[coin.symbol] = { coinfig: coin }
      })

      assets.MATIC.coinfig.type.logoPngUrl = assets["MATIC.MATIC"].coinfig.type.logoPngUrl

      // switch up the erc20 addresses to support testnet (for opensea testing)
      if (openSeaApi && openSeaApi.includes('testnets')) {
        assets.WETH.coinfig.type.erc20Address = '0xc778417E063141139Fce010982780140Aa0cD5Ab'
        assets.DAI.coinfig.type.erc20Address = '0x68b3465833fb72a70ecdf485e0e4c7bd8665fc45'
      }

      postMessage(JSON.stringify(assets))
    } catch (e) {
      postMessage('error')
    }
  })
})
