import { CoinType, FiatType, SBPairType } from 'core/types'

export const NO_PAIR_SELECTED = 'NO_PAIR_SELECTED'

const splitPair = (pair: SBPairType) => {
  return pair.pair.split('-')
}
export const getCoinFromPair = (pair: SBPairType): CoinType => {
  return splitPair(pair)[0] as CoinType
}

export const getFiatFromPair = (pair: SBPairType): FiatType => {
  return splitPair(pair)[1] as FiatType
}
