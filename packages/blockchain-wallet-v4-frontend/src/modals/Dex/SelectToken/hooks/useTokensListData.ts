import type { DexTokenWithBalance } from '@core/network/api/dex'
import type { RootState } from 'data/rootReducer'
import { useRemote } from 'hooks'

import { getRemote } from '../SelectToken.selectors'

export const useTokensListData = ():
  | { type: 'ERROR' }
  | { type: 'LOADING' }
  | { type: 'IS_EMPTY' }
  | { data: DexTokenWithBalance[]; type: 'SUCCESS' } => {
  const { data, hasError, isLoading } = useRemote<string, DexTokenWithBalance[], RootState>(
    // @ts-ignore
    getRemote
  )

  if (isLoading) return { type: 'LOADING' }
  if (hasError) return { type: 'ERROR' }
  if (!data || data.length < 1) return { type: 'IS_EMPTY' }

  return { data, type: 'SUCCESS' }
}
