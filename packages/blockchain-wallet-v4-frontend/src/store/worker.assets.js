/* eslint-disable */

// utility to parse result from promise
const parsePromiseResponse = res => res.ok ? res.json() : Promise.resolve({})

// main function to fetch and manipulate application coin config
addEventListener('message', ({ data }) => {
  const { assetApi, openSeaApi, erc20Whitelist } = JSON.parse(data)

  // fetch custodial/erc20 assets
  const custodialAssets = fetch(`${assetApi}/assets/currencies/custodial`).then(parsePromiseResponse)
  const erc20Assets = fetch(`${assetApi}/assets/currencies/erc20`).then(parsePromiseResponse)

  Promise.all([custodialAssets, erc20Assets])
    .then(([custodialAssets, erc20Assets]) => {
      let supportedCoins = custodialAssets.currencies
      let supportedErc20s = erc20Assets.currencies

      // filter full erc20 list to match whitelist if it exists
      if (erc20Whitelist) {
        supportedCoins = supportedCoins.filter(({ type, symbol }) =>
          type.name !== 'ERC20' ? true : erc20Whitelist.indexOf(symbol) >= 0
        )
        supportedErc20s = []
      }

      const assets = {
        ...supportedCoins.reduce((acc, curr) => {
          if (curr.symbol.includes('.')) return acc
          return {
            ...acc,
            [curr.symbol]: { coinfig: curr }
          }
        }, {}),
        ...supportedErc20s.reduce((acc, curr) => {
          if (curr.symbol.includes('.')) return acc
          return {
            ...acc,
            [curr.symbol]: { coinfig: curr }
          }
        }, {})
      }

      // TODO: remove this once backend adds flags
      assets.XLM.coinfig.type.isMemoBased = true

      // TODO: remove once backend returns this
      assets.STX.coinfig.products.push('DynamicSelfCustody')

      // if opensea is on rinkeby, modify contract addresses
      if (openSeaApi && openSeaApi.includes('rinkeby')) {
        assets.WETH.coinfig.type.erc20Address = '0xc778417E063141139Fce010982780140Aa0cD5Ab'
        assets.DAI.coinfig.type.erc20Address = '0x68b3465833fb72a70ecdf485e0e4c7bd8665fc45'
      }


      postMessage(JSON.stringify(assets))
    })
})