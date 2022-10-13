import { useMemo } from 'react'
import { flatten } from 'ramda'

import { Remote } from '@core'
import { getData as getBchAddressData } from 'components/Form/SelectBoxBchAddresses/selectors'
import { getData as getBtcAddressData } from 'components/Form/SelectBoxBtcAddresses/selectors'
import { getData as getCoinAddressData } from 'components/Form/SelectBoxCoinAddresses/selectors'
import {
  getErc20Data as getErc20AddressData,
  getEthData as getEthAddressData
} from 'components/Form/SelectBoxEthAddresses/selectors'
import { getData as getXlmAddressData } from 'components/Form/SelectBoxXlmAddresses/selectors'
import { selectors } from 'data'

import { useRemote } from '../useRemote'
import { AddressData, WalletsForCoinHook } from './useWalletsForCoin.types'

export const useWalletsForCoin: WalletsForCoinHook = ({ coin }) => {
  const isErc20Coin = useMemo(
    () => selectors.core.data.coins.getErc20Coins().includes(coin),
    [coin]
  )

  const isCustodialCoin = useMemo(
    () => selectors.core.data.coins.getCustodialCoins().includes(coin),
    [coin]
  )

  const isBTC = coin === 'BTC'
  const isBCH = coin === 'BCH'
  const isETH = coin === 'ETH'
  const isXLM = coin === 'XLM'
  const isEUR = coin === 'EUR'
  const isGBP = coin === 'GBP'
  const isUSD = coin === 'USD'

  const isFiatCoin = isEUR || isGBP || isUSD

  const { data, ...state } = useRemote<string, AddressData>((state) => {
    if (isBTC) {
      return getBtcAddressData(state, {
        includeAll: false,
        includeCustodial: true,
        includeInterest: true
      })
    }

    if (isBCH) {
      return getBchAddressData(state, {
        coin: 'BCH',
        includeCustodial: true,
        includeInterest: true
      })
    }

    if (isETH) {
      return getEthAddressData(state, {
        includeCustodial: true,
        includeInterest: true,
        includeStaking: true
      })
    }

    if (isXLM) {
      return getXlmAddressData(state, {
        includeCustodial: true,
        includeInterest: true
      })
    }

    if (isFiatCoin) {
      return Remote.Success({ data: [] })
    }

    if (isErc20Coin) {
      return getErc20AddressData(state, {
        coin,
        includeCustodial: true,
        includeInterest: true
      })
    }

    if (isCustodialCoin) {
      return getCoinAddressData(state, {
        coin,
        includeCustodial: true,
        includeInterest: true
      })
    }

    return Remote.Success({ data: [] })
  })

  const wallets = useMemo(() => {
    if (!data) return data

    const options = flatten(data.data.map((datum) => datum.options))

    return options.map((option) => option.value)
  }, [data])

  return {
    ...state,
    data: wallets
  }
}
