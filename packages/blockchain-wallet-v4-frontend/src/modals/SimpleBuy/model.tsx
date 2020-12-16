import {
  CoinType,
  FiatType,
  SBOrderActionType,
  SBOrderType,
  SupportedWalletCurrenciesType,
  SupportedWalletCurrencyType
} from 'core/types'
import { convertBaseToStandard } from 'data/components/exchange/services'
import { fiatToString } from 'core/exchange/currency'
import { FormattedMessage } from 'react-intl'
import {
  getBaseCurrency,
  getCounterCurrency,
  getOrderType
} from 'data/components/simpleBuy/model'
import React from 'react'

export const BuyOrSell = (props: {
  coinModel: SupportedWalletCurrencyType
  crypto?: 'Crypto' | CoinType
  orderType: SBOrderActionType
}) => {
  if (props.crypto) {
    return props.orderType === 'BUY' ? (
      <FormattedMessage
        id='buttons.buy_coin'
        defaultMessage='Buy {displayName}'
        values={{
          displayName:
            props.crypto === 'Crypto' ? 'Crypto' : props.coinModel.coinTicker
        }}
      />
    ) : (
      <FormattedMessage
        id='buttons.sell_coin'
        defaultMessage='Sell {displayName}'
        values={{ displayName: props.coinModel.coinTicker }}
      />
    )
  }

  return props.orderType === 'BUY' ? (
    <FormattedMessage id='buttons.buy' defaultMessage='Buy' />
  ) : (
    <FormattedMessage id='buttons.sell' defaultMessage='Sell' />
  )
}

export const getOrderDestination = (order: SBOrderType, supportedCoins) => {
  const orderType = getOrderType(order)
  const baseCurrency = getBaseCurrency(order, supportedCoins)
  const counterCurrency = getCounterCurrency(order, supportedCoins)

  return orderType === 'BUY'
    ? `${baseCurrency} Trading Wallet`
    : `${counterCurrency} Wallet`
}

export const getPaymentMethod = (
  order: SBOrderType,
  supportedCoins: SupportedWalletCurrenciesType
) => {
  const baseCurrency = getBaseCurrency(order, supportedCoins)
  const counterCurrency = getCounterCurrency(order, supportedCoins)
  const orderType = getOrderType(order)

  switch (order.paymentType) {
    case 'PAYMENT_CARD':
      return (
        <FormattedMessage
          id='modals.simplebuy.confirm.payment_card'
          defaultMessage='Credit Card'
        />
      )
    case 'FUNDS':
      return orderType === 'BUY' ? (
        <FormattedMessage
          id='modals.simplebuy.confirm.funds_wallet'
          defaultMessage='{coin} Wallet'
          values={{
            coin: counterCurrency
          }}
        />
      ) : (
        `${baseCurrency} Trading Wallet`
      )
    default:
      return (
        <FormattedMessage
          id='modals.simplebuy.deposit.bank_transfer'
          defaultMessage='Bank Transfer'
        />
      )
  }
}

export const displayFiat = (
  order: SBOrderType,
  supportedCoins: SupportedWalletCurrenciesType,
  amt: string
) => {
  const counterCurrency = getCounterCurrency(order, supportedCoins)

  return fiatToString({
    unit: counterCurrency as FiatType,
    value: convertBaseToStandard('FIAT', amt)
  })
}

export const getBankLogoImageName = bankName => {
  switch (bankName) {
    case 'Acorns':
      return 'acorns'
    case 'Ally':
      return 'ally'
    case 'Bank Of America':
      return 'bank-of-america'
    case 'BB&T':
      return 'bbt'
    case 'Capital One':
      return 'capital-one'
    case 'Chase':
      return 'chase'
    case 'Citi Bank':
      return 'citi-bank'
    case 'Citizens':
      return 'citizens'
    case 'Navy Federal':
      return 'navy-federal'
    case 'PNC':
      return 'pnc'
    case 'Regions':
      return 'regions'
    case 'Robinhood':
      return 'robinhood'
    case 'Suntrust':
      return 'suntrust'
    case 'TD':
      return 'td'
    case 'USAA':
      return 'usaa'
    case 'US Bank':
      return 'us-bank'
    case 'Venmo':
      return 'venmo'
    case 'Wells Fargo':
      return 'wells-fargo'
    default:
      return 'bank'
  }
}
