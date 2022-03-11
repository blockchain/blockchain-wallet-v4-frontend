declare global {
  interface Window { coins: {[key: string]: unknown}; }
}

export const addIconsToWindow = () => {
  window.coins = {
    BTC: {
      coinfig: {
        symbol: "WBTC",
        displaySymbol: "WBTC",
        name: "Wrapped Bitcoin",
        type: {
          logoPngUrl: "https://raw.githubusercontent.com/blockchain/coin-definitions/master/extensions/blockchains/ethereum/assets/0x2260FAC5E5542a773Aa44fBCfeDf7C193bc2C599/logo.png",
        },
      }
    },
    AAVE: {
      coinfig: {
        symbol: 'AAVE',
        name: 'Aave',
        type: {
          logoPngUrl:
            'https://raw.githubusercontent.com/blockchain/coin-definitions/master/extensions/blockchains/ethereum/assets/0x7Fc66500c84A76Ad7e9c93437bFc5Ac33E2DDaE9/logo.png',
        },
      }
    },
    XLM: {
      coinfig: {
        name: 'Stellar',
        precision: 7,
        products: ['PrivateKey'],
        symbol: 'XLM',
        type: {
          logoPngUrl: 'https://raw.githubusercontent.com/blockchain/coin-definitions/master/extensions/blockchains/stellar/info/logo.png'
        }
      }
    },
    ETH: {
      coinfig: {
        name: 'Stellar',
        precision: 7,
        products: ['PrivateKey'],
        symbol: 'XLM',
        type: {
          logoPngUrl: 'https://raw.githubusercontent.com/blockchain/coin-definitions/master/extensions/blockchains/ethereum/info/logo.png'
        }
      }
    }
  }
}
