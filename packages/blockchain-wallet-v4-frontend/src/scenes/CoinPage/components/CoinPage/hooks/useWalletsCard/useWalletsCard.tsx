import React, { ReactNode, useMemo } from 'react'
import {
  useCoinBalance,
  useCoinRates,
  useCurrency,
  useOpenShowWalletModal,
  useWalletsForCoin
} from 'hooks'

import { CoinType } from '@core/types'
import { Icon } from 'blockchain-info-components'
import { IconCircularBackground } from 'components/IconCircularBackground'
import { StandardRow } from 'components/Rows'

import { WalletsCard } from '../../../WalletsCard'
import { transformToAccounts } from './utils'

export const useWalletsCard = (coin: CoinType): [ReactNode] => {
  const currency = useCurrency()

  const {
    data: rates,
    isLoading: isLoadingCoinRates,
    isNotAsked: isCoinRatesNotAsked
  } = useCoinRates({ coin })

  const {
    data: available,
    isLoading: isLoadingCoinBalance,
    isNotAsked: isCoinBalanceNotAsked
  } = useCoinBalance({
    coin
  })

  const {
    data: coinAddressesData,
    isLoading: isLoadingAddressData,
    isNotAsked: isAddressDataNotAsked
  } = useWalletsForCoin({ coin })

  const [openWalletModal] = useOpenShowWalletModal()

  const isNotAsked = useMemo(
    () => isCoinRatesNotAsked && isCoinBalanceNotAsked && isAddressDataNotAsked,
    [isCoinRatesNotAsked, isCoinBalanceNotAsked, isAddressDataNotAsked]
  )

  const isLoading = useMemo(
    () => isLoadingCoinRates && isLoadingCoinBalance && isLoadingAddressData,
    [isLoadingCoinRates, isLoadingCoinBalance, isLoadingAddressData]
  )

  const accounts = useMemo(() => {
    if (rates === undefined) return []

    return (
      coinAddressesData?.map(({ address, balance, label }) => ({
        ...transformToAccounts({
          coin,
          currency,
          rates,
          value: balance ?? available ?? 0
        }),
        address,
        coin,
        key: address,
        label
      })) ?? []
    )
  }, [coinAddressesData, rates, currency, available])

  const walletsCardNode = useMemo(() => {
    if (isLoading || isNotAsked) {
      return (
        <WalletsCard>
          <StandardRow loading />
          <StandardRow loading />
          <StandardRow loading />
        </WalletsCard>
      )
    }

    if (rates === undefined || available === undefined) {
      return <WalletsCard>Somthing went wrong</WalletsCard>
    }

    return (
      <WalletsCard>
        {accounts?.map(({ address, coin, key, label, totalCrypto, totalFiat }) => (
          <StandardRow
            key={key}
            bottomLeftText={label}
            bottomRightText={totalCrypto}
            onClick={() => openWalletModal({ address, coin, origin: 'CoinPageHoldings' })}
            topLeftText={label}
            topRightText={totalFiat}
            icon={
              <IconCircularBackground color='grey200'>
                <Icon name='key' size='8px' color='grey600' />
              </IconCircularBackground>
            }
          />
        ))}
      </WalletsCard>
    )
  }, [isLoading, isNotAsked, rates, accounts, available, openWalletModal])

  return [walletsCardNode]
}
