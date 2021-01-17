import { uniq } from 'ramda'

import { CoinType } from 'core/types'
import { getInputFromPair, getOutputFromPair } from 'data/components/swap/model'
import { RootState } from 'data/rootReducer'
import { selectors } from 'data'
import { SWAP_SELECTOR_CONFIG } from 'coins'
import { SwapAccountType, SwapCoinType } from 'data/components/swap/types'

import { OwnProps } from '.'

export const getData = (state: RootState, { side }: OwnProps) => {
  const accounts = selectors.components.swap.getActiveAccounts(state, SWAP_SELECTOR_CONFIG)
  const pairs = selectors.components.swap.getPairs(state).getOrElse([])
  let coinsForSide

  if (!pairs.length) return { accounts }

  const sideF = side === 'BASE' ? getInputFromPair : getOutputFromPair
  // @ts-ignore
  coinsForSide = uniq(pairs.map(sideF))

  // This will only work if the coin is disabled for to and from
  const accountsForSide = coinsForSide.reduce(
    (prevValue, curValue: CoinType) => {
      if (!prevValue[curValue]) {
        return {
          ...prevValue,
          [curValue]: accounts[curValue]
        }
      }
    },
    {}
  ) as { [key in SwapCoinType]: Array<SwapAccountType> }

  return { accounts: accountsForSide }
}
