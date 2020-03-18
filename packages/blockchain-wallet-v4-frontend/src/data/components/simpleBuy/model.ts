import { CoinType, SBPairType } from 'core/types'

export const getCoinFromPair = (pair: SBPairType): CoinType => {
  return pair.pair.split('-')[0] as CoinType
}
