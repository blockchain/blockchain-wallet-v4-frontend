import { sortCoins } from './utils'

describe('sortCoins', () => {
  it('should sort by trading asset and market cap descending, and name ascending', function () {
    const coins = [
      {
        marketCap: 1_000_000_000_000,
        name: 'A no name token',
        products: []
      },
      {
        marketCap: 143_384_797_008,
        name: 'Ethereum (ETH)',
        products: ['CustodialWalletBalance' as const]
      },
      {
        marketCap: 331_609_356_886,
        name: 'A same market cap but different name Bitcoin (BTC)',
        products: ['CustodialWalletBalance' as const]
      },
      {
        marketCap: 331_609_356_886,
        name: 'Bitcoin (BTC)',
        products: ['CustodialWalletBalance' as const]
      }
    ]

    const sortedCoins = sortCoins(coins)
    expect(sortedCoins).toEqual([coins[2], coins[3], coins[1], coins[0]])
  })
})
