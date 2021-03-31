import React from 'react'
import { FormattedMessage } from 'react-intl'

import { fiatToString } from 'blockchain-wallet-v4/src/exchange/currency'
import {
  BankTransferAccountType,
  CoinType,
  FiatType,
  SBOrderActionType,
  SBOrderType,
  SupportedWalletCurrenciesType,
  SupportedWalletCurrencyType
} from 'blockchain-wallet-v4/src/types'
import { convertBaseToStandard } from 'data/components/exchange/services'
import {
  getBaseCurrency,
  getCounterCurrency,
  getOrderType
} from 'data/components/simpleBuy/model'

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
            props.crypto === 'Crypto' ? 'Crypto' : props.coinModel?.coinTicker
        }}
      />
    ) : (
      <FormattedMessage
        id='buttons.sell_coin'
        defaultMessage='Sell {displayName}'
        values={{ displayName: props.coinModel?.coinTicker }}
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
    ? `${baseCurrency} Trading Account`
    : `${counterCurrency} Account`
}

export const getPaymentMethod = (
  order: SBOrderType,
  supportedCoins: SupportedWalletCurrenciesType,
  bankAccount: BankTransferAccountType
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
        `${baseCurrency} Trading Account`
      )
    case 'BANK_TRANSFER':
      const defaultBankInfo = {
        bankName: 'Bank Transfer',
        bankAccountType: '',
        accountNumber: ''
      }
      const d = (bankAccount && bankAccount.details) || defaultBankInfo
      return `${d.bankName} ${d.bankAccountType?.toLowerCase() || ''} ${
        d.accountNumber
      }`
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
