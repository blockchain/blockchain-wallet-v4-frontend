import * as selectors from './selectors'

const COINS_STUB: Window['coins'] = {
  USDC: {
    coinfig: {
      displaySymbol: 'USDC',
      name: 'USD Coin',
      precision: 6,
      products: [],
      symbol: 'USDC',
      type: {
        erc20Address: '0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48',
        logoPngUrl:
          'https://raw.githubusercontent.com/blockchain/coin-definitions/master/extensions/blockchains/ethereum/assets/0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48/logo.png',
        name: 'ERC20',
        parentChain: 'ETH',
        websiteUrl: 'https://centre.io/usdc'
      }
    }
  }
}

describe('Coins selectors', () => {
  describe('getCoins', () => {
    describe('when there are no window.coins', () => {
      const originalStub = { ...window.coins }

      beforeEach(() => {
        // @ts-expect-error
        delete window.coins
      })

      afterEach(() => {
        window.coins = originalStub
      })

      it('should return empty object', () => {
        expect(selectors.getCoins()).toEqual({})
      })
    })

    describe('when there are window.coins', () => {
      const originalStub = { ...window.coins }

      beforeEach(() => {
        window.coins = COINS_STUB
      })

      afterEach(() => {
        window.coins = originalStub
      })

      it('should return window.coins object', () => {
        expect(selectors.getCoins()).toEqual(COINS_STUB)
      })
    })
  })

  it.todo('other selectors')
})
