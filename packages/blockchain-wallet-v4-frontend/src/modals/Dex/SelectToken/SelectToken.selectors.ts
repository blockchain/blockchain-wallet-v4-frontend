import { CoinType } from '@core/types'
import { getBalanceSelector, getErc20Balance } from 'components/Balances/selectors'

// TODO: move these
type DexToken = {
  address: string
  chainId: number
  decimals: number
  name: string
  symbol: CoinType
  verifiedBy: number
}
type DexTokenList = Array<DexToken>

export const getData = (state) => {
  // TODO: use API endpoints for token lists
  const mockApiResults: DexTokenList = [
    {
      address: '0xad6d458402f60fd3bd25163575031acdce07538d',
      chainId: 3,
      decimals: 18,
      name: 'Dai Stablecoin',
      symbol: 'DAI',
      verifiedBy: 1
    },
    {
      address: '0x1f9840a85d5af5bf1d1762f925bdaddc4201f984',
      chainId: 3,
      decimals: 18,
      name: 'Uniswap',
      symbol: 'UNI',
      verifiedBy: 1
    },
    {
      address: '0xc778417e063141139fce010982780140aa0cd5ab',
      chainId: 3,
      decimals: 18,
      name: 'Wrapped Ether',
      symbol: 'WETH',
      verifiedBy: 1
    }
  ]

  return mockApiResults.map((token: DexToken) => {
    const { coinfig } = window.coins[token.symbol]
    const coinBalance = getBalanceSelector(coinfig.symbol)(state).getOrElse(0)

    return {
      balance:
        coinfig.type.name === 'ERC20'
          ? getErc20Balance(coinfig.symbol)(state).getOrElse(0)
          : coinBalance,
      ...coinfig
    }
  })
}
