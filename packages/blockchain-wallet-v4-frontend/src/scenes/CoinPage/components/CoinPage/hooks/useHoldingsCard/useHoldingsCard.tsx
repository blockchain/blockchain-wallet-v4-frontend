import React, { ReactElement, useCallback, useMemo } from 'react'

import { Exchange } from '@core'
import { fiatToString } from '@core/exchange/utils'
import {
  useCoinBalance,
  useCoinConfig,
  useCoinRates,
  useCurrency,
  useOpenBuyFlow,
  useOpenReceiveCryptoModal,
  useOpenSellFlow,
  useOpenSendCryptoModal
} from 'hooks'

import { BuyButton } from '../../../BuyButton'
import { CoinTotalLoadingText, HoldingsCard, TotalLoadingText } from '../../../HoldingsCard'
import { ReceiveButton } from '../../../ReceiveButton'
import { SellButton } from '../../../SellButton'
import { SendButton } from '../../../SendButton'
import { HoldingsCardHook } from './types'

export const useHoldingsCard: HoldingsCardHook = ({ coin }) => {
  const currency = useCurrency()
  const { data: coinfig, isLoading: isLoadingCoinConfig } = useCoinConfig({ coin })
  const openOpenBuyFlow = useOpenBuyFlow()
  const openOpenSellFlow = useOpenSellFlow()
  const openOpenReceiveCryptoModal = useOpenReceiveCryptoModal()
  const openOpenSendCryptoModal = useOpenSendCryptoModal()

  const { data: coinBalance, isLoading: isCoinBalanceLoading } = useCoinBalance({ coin })

  const { data: rates, isLoading: isRatesLoading } = useCoinRates({ coin })

  const isLoading = useMemo(
    () => isCoinBalanceLoading || isRatesLoading || isLoadingCoinConfig,
    [isCoinBalanceLoading, isRatesLoading, isLoadingCoinConfig]
  )

  const formatFiat = useCallback((value) => fiatToString({ unit: currency, value }), [currency])

  const formatCoin = useCallback(
    (value) =>
      Exchange.displayCoinToCoin({
        coin,
        isFiat: coinfig?.type.name === 'FIAT',
        value
      }),
    [coin, coinfig?.type.name]
  )

  const actions: ReactElement[] = useMemo(() => {
    if (coinBalance === undefined || !coinfig) return []

    const isBroke = coinBalance <= 0
    const isCustodialWalletBalance = coinfig.products.includes('CustodialWalletBalance')
    const isPrivateKey = coinfig.products.includes('PrivateKey')

    const buyButtonCallback = () => openOpenBuyFlow({ coin, origin: 'CoinPageHoldings' })
    const sellButtonCallback = () => openOpenSellFlow({ coin, origin: 'CoinPageHoldings' })
    const sendButtonCallback = () => openOpenSendCryptoModal({ coin, origin: 'CoinPageHoldings' })
    const receiveButtonCallback = () =>
      openOpenReceiveCryptoModal({ coin, origin: 'CoinPageHoldings' })

    if (isCustodialWalletBalance && !isBroke) {
      // user can buy/sell and has a balance
      return [
        <BuyButton key={1} onClick={buyButtonCallback} />,
        <SellButton key={2} onClick={sellButtonCallback} />
      ]
    }

    if (isCustodialWalletBalance && isBroke) {
      // user has a balance
      return [
        <BuyButton key={1} onClick={buyButtonCallback} />,
        <ReceiveButton key={2} onClick={receiveButtonCallback} />
      ]
    }

    if (isPrivateKey && isBroke) {
      // user cannot buy/sell
      return [<ReceiveButton key={1} onClick={receiveButtonCallback} />]
    }

    return [
      <SendButton key={1} onClick={sendButtonCallback} disabled={isBroke} />,
      <ReceiveButton key={2} onClick={receiveButtonCallback} />
    ]
  }, [
    coinBalance,
    coinfig,
    openOpenBuyFlow,
    coin,
    openOpenSellFlow,
    openOpenSendCryptoModal,
    openOpenReceiveCryptoModal
  ])

  const holdingsNode = useMemo(() => {
    if (isLoading)
      return (
        <HoldingsCard
          total={<TotalLoadingText />}
          coinCode={coin}
          coinTotal={<CoinTotalLoadingText />}
        />
      )
    if (!rates || !coinBalance) {
      return (
        <HoldingsCard
          total={formatFiat(0)}
          coinCode={coin}
          coinTotal={formatCoin(0)}
          actions={actions}
        />
      )
    }

    const totalFiatAmount = Exchange.convertCoinToFiat({
      coin,
      currency,
      isStandard: false,
      rates,
      value: coinBalance
    })

    const coinTotalAmount = formatCoin(coinBalance)
    const totalFiatFormatted = formatFiat(totalFiatAmount)

    return (
      <HoldingsCard
        total={totalFiatFormatted ?? ''}
        coinCode={coin}
        coinTotal={coinTotalAmount}
        actions={actions}
      />
    )
  }, [isLoading, coin, rates, coinBalance, currency, formatCoin, formatFiat, actions])

  return [holdingsNode]
}
