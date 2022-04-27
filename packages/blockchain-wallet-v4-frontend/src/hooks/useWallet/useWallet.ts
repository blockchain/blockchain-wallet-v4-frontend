import { useMemo } from 'react'

import { useWalletsForCoin } from '../useWalletsForCoin'
import { WalletHook } from './useWallet.types'

export const useWallet: WalletHook = ({ address, coin }) => {
  const { data, ...state } = useWalletsForCoin({
    coin
  })

  const wallet = useMemo(() => {
    if (!data) return undefined

    const filteredWallets = data.filter((wallet) => wallet.address === address)

    if (filteredWallets.length) return filteredWallets[0]

    return undefined
  }, [address, data])

  return {
    ...state,
    data: wallet
  }
}
