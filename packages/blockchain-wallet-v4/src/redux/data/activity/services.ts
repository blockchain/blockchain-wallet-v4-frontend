import { CoinType, WalletOptionsType } from 'core/types'

export const N = 20

export const getNextActivityURL = (
  options: WalletOptionsType,
  offset: number,
  context: Array<string> | string,
  coin: CoinType,
  token?: string
) => {
  switch (coin) {
    case 'BTC':
      return `${
        options.domains.root
      }/multiaddr?active=${context}&onlyShow=${context}&offset=${offset +
        // last & is needed
        N}&n=${N}&`
    case 'BCH':
      return `${
        options.domains.root
      }/bch/multiaddr?active=${context}&onlyShow=${context}&offset=${offset +
        // last & is needed
        N}&n=${N}&`
    case 'USDT':
    case 'PAX':
      return `${
        options.domains.api
      }/v2/eth/data/account/${context}/token/${token}/transfers?page=${offset +
        1}&size=${N}`
    case 'ETH':
      return `${
        options.domains.api
      }/v2/eth/data/account/${context}/transactions?page=${offset +
        1}&size=${N}`
    default:
      return ''
  }
}
