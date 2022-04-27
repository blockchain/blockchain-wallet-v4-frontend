import { useRemote } from 'blockchain-wallet-v4-frontend/src/hooks/useRemote'

import { CoinRemoteHookUtility } from './useCoinRemoteHook.types'

export const useCoinRemoteHook: CoinRemoteHookUtility = ({ mapper, selector }) => {
  const state = useRemote(selector)

  const { data } = state

  if (data === undefined)
    return {
      ...state,
      data: undefined
    }

  return {
    ...state,
    data: mapper(data)
  }
}
