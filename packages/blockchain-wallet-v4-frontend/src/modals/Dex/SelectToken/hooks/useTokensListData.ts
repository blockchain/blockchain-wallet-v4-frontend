import { useSelector } from 'react-redux'

import type { DexTokenWithBalance } from '@core/network/api/dex'
import { selectors } from 'data'
import type { RootState } from 'data/rootReducer'
import { useRemote } from 'hooks'
import { notReachable } from 'utils/helpers'

import { getDexTokensList } from '../SelectToken.selectors'

export const useTokensListData = ():
  | { type: 'ERROR' }
  | { type: 'LOADING' }
  | { type: 'ERROR' }
  | { type: 'IS_EMPTY' }
  | { data: DexTokenWithBalance[]; type: 'LOADED' }
  | { data: DexTokenWithBalance[]; type: 'LOADING_MORE' }
  | { data: DexTokenWithBalance[]; type: 'NO_MORE_TOKENS' } => {
  const { status } = useSelector(selectors.components.dex.getCurrentChainTokensMeta)
  const { data, hasError, isLoading } = useRemote<string, DexTokenWithBalance[], RootState>(
    getDexTokensList
  )

  if (isLoading) return { type: 'LOADING' }
  if (hasError) return { type: 'ERROR' }
  if (!data || data.length < 1) return { type: 'IS_EMPTY' }

  switch (status) {
    case 'LOADED':
      return { data, type: 'LOADED' }
    case 'LOADING_MORE':
      return { data, type: 'LOADING_MORE' }
    case 'NO_MORE_TOKENS':
      return { data, type: 'NO_MORE_TOKENS' }
    default:
      return notReachable(status)
  }
}
