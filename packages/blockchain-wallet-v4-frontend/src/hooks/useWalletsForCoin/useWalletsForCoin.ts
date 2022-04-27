import { useCallback } from 'react'

import { Remote } from '@core'

import { useCoinCheck } from '../useCoinCheck'
import {
  AddressData,
  createBCHWalletsSelector,
  createBTCWalletsSelector,
  createCustodialWalletsSelector,
  createERC20WalletsSelector,
  createETHWalletsSelector,
  createXLMWalletsSelector,
  mapAddressDataToWalletsData,
  useCoinRemoteHook,
  WalletsHookData
} from '../useWallets'
import { WalletsForCoinHook } from './useWalletsForCoin.types'

export const useWalletsForCoin: WalletsForCoinHook = ({ coin }) => {
  const { isBCH, isBTC, isCustodialCoin, isETH, isErc20Coin, isFiatCoin, isXLM } = useCoinCheck()

  const getCoinSelector = useCallback(
    (coin: string) => {
      if (isBTC(coin)) {
        return createBTCWalletsSelector()
      }

      if (isBCH(coin)) {
        return createBCHWalletsSelector()
      }

      if (isETH(coin)) {
        return createETHWalletsSelector()
      }

      if (isXLM(coin)) {
        return createXLMWalletsSelector()
      }

      if (isFiatCoin(coin)) {
        return () => Remote.Success({ data: [] })
      }

      if (isErc20Coin(coin)) {
        return createERC20WalletsSelector({ coin })
      }

      if (isCustodialCoin(coin)) {
        return createCustodialWalletsSelector({ coin })
      }

      throw new Error(`Coin address for coin "${coin}" not handled`)
    },
    [isCustodialCoin, isBTC, isBCH, isETH, isXLM, isFiatCoin]
  )

  return useCoinRemoteHook<string, WalletsHookData[], AddressData>({
    mapper: mapAddressDataToWalletsData,
    selector: getCoinSelector(coin)
  })
}
