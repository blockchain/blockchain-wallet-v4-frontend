import React, { ReactNode, useMemo } from 'react'

import { CoinType } from '@core/types'
import { Icon } from 'blockchain-info-components'
import { IconCircularBackground } from 'components/IconCircularBackground'
import { StandardRow } from 'components/Rows'
import {
  getCoinColor,
  useCoinBalance,
  useCoinRates,
  useCurrency,
  useOpenViewInterestAccountModal,
  useOpenViewPrivateKeyModal,
  useOpenViewTradingAccount,
  useWalletsForCoin
} from 'hooks'

import { WalletsCard } from '../../../WalletsCard'
import { transformToAccounts } from './utils'

export const useWalletsCard = (coin: CoinType): [ReactNode] => {
  const currency = useCurrency()
  const openViewPrivateKeyModal = useOpenViewPrivateKeyModal()
  const openViewInterestAccountModal = useOpenViewInterestAccountModal()
  const openViewTradingAccount = useOpenViewTradingAccount()

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

  const isNotAsked = useMemo(
    () => isCoinRatesNotAsked || isCoinBalanceNotAsked || isAddressDataNotAsked,
    [isCoinRatesNotAsked, isCoinBalanceNotAsked, isAddressDataNotAsked]
  )

  const isLoading = useMemo(
    () => isLoadingCoinRates || isLoadingCoinBalance || isLoadingAddressData,
    [isLoadingCoinRates, isLoadingCoinBalance, isLoadingAddressData]
  )

  const accounts = useMemo(() => {
    if (rates === undefined) return []

    return (
      coinAddressesData?.map(({ address, balance, label, type }) => ({
        ...transformToAccounts({
          coin,
          currency,
          rates,
          value: balance ?? available ?? 0
        }),
        key: address,
        label,
        type
      })) ?? []
    )
  }, [rates, coinAddressesData, coin, currency, available])

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
        {accounts?.map(({ key, label, totalCrypto, totalFiat, type }) => {
          const coinColor = getCoinColor(coin)

          return (
            <StandardRow
              key={key}
              bottomLeftText={label}
              bottomRightText={totalCrypto}
              onClick={() => {
                if (type === 'ACCOUNT') {
                  openViewPrivateKeyModal({
                    coin,
                    origin: 'CoinPageHoldings'
                  })
                }

                if (type === 'CUSTODIAL') {
                  openViewTradingAccount({
                    coin,
                    origin: 'CoinPageHoldings'
                  })
                }

                if (type === 'INTEREST') {
                  openViewInterestAccountModal({
                    coin,
                    origin: 'CoinPageHoldings'
                  })
                }
              }}
              topLeftText={label}
              topRightText={totalFiat}
              icon={
                <IconCircularBackground color={coinColor || 'grey-200'}>
                  <Icon name='key' size='8px' color='white' />
                </IconCircularBackground>
              }
            />
          )
        })}
      </WalletsCard>
    )
  }, [
    isLoading,
    isNotAsked,
    rates,
    available,
    accounts,
    coin,
    openViewPrivateKeyModal,
    openViewTradingAccount,
    openViewInterestAccountModal
  ])

  return [walletsCardNode]
}
