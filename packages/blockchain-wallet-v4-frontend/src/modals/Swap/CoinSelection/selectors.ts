import { uniq } from 'ramda'

import { CoinType } from 'blockchain-wallet-v4/src/types'
import { selectors } from 'data'
import { SWAP_ACCOUNTS_SELECTOR } from 'data/coins/model/swap'
import { getCoinAccounts } from 'data/coins/selectors'
import { getInputFromPair, getOutputFromPair } from 'data/components/swap/model'
import { SwapAccountType } from 'data/components/swap/types'
import { RootState } from 'data/rootReducer'

import { OwnProps } from '.'

export const getData = (state: RootState, { side }: OwnProps) => {
  const accounts = getCoinAccounts(state, SWAP_ACCOUNTS_SELECTOR)
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
  ) as { [key in CoinType]: Array<SwapAccountType> }

  return { accounts: accountsForSide }
}
