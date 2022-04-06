import React, { useMemo } from 'react'
import {
  useCoinBalance,
  useCoinConfig,
  useCoinRates
} from 'blockchain-wallet-v4-frontend/src/hooks'

import { Exchange } from '@core'
import { fiatToString } from '@core/exchange/utils'

import { HoldingsCard } from '../../../HoldingsCard'
import { useCurrency } from '../useCurrency'
import { HoldingsCardHook } from './types'

export const useHoldingsCard: HoldingsCardHook = ({ coin }) => {
  const coinfig = useCoinConfig({ coin })

  const { data: rates } = useCoinRates({
    coin
  })

  const currency = useCurrency()
  const { data: balance } = useCoinBalance({ coin })

  const totalFiatAmount = useMemo(() => {
    if (!rates) return undefined

    return Exchange.convertCoinToFiat({
      coin,
      currency,
      isStandard: false,
      rates,
      value: balance
    })
  }, [])

  const totalFiatFormatted = useMemo(() => {
    if (!totalFiatAmount) return

    return fiatToString({ unit: currency, value: totalFiatAmount })
  }, [totalFiatAmount])

  const coinTotalAmount = useMemo(() => {
    if (!balance) return

    return Exchange.displayCoinToCoin({
      coin,
      isFiat: coinfig.type.name === 'FIAT',
      value: balance
    })
  }, [])

  const holdingsCardNode = useMemo(() => {
    return (
      <HoldingsCard
        actions={[]}
        total={totalFiatFormatted || '--'}
        coinCode={coin}
        coinTotal={coinTotalAmount || '--'}
      />
    )
  }, [coin])

  return [holdingsCardNode]
}
