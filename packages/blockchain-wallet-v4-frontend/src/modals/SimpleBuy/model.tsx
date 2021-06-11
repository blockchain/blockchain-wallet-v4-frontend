import React from 'react'
import { FormattedMessage } from 'react-intl'

import { fiatToString } from 'blockchain-wallet-v4/src/exchange/currency'
import {
  CoinType,
  FiatType,
  SBCardType,
  SBOrderActionType,
  SBOrderType,
  SBPaymentTypes,
  SupportedWalletCurrenciesType,
  SupportedWalletCurrencyType
} from 'blockchain-wallet-v4/src/types'
import { convertBaseToStandard } from 'data/components/exchange/services'
import { getBaseCurrency, getCounterCurrency, getOrderType } from 'data/components/simpleBuy/model'
import { BankTransferAccountType } from 'data/types'

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
          displayName: props.crypto === 'Crypto' ? 'Crypto' : props.coinModel?.coinTicker
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

  return orderType === 'BUY' ? `${baseCurrency} Trading Account` : `${counterCurrency} Account`
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
    case SBPaymentTypes.PAYMENT_CARD:
      return (
        <FormattedMessage id='modals.simplebuy.confirm.payment_card' defaultMessage='Credit Card' />
      )
    case SBPaymentTypes.FUNDS:
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
    case SBPaymentTypes.BANK_TRANSFER:
      const defaultBankInfo = {
        accountNumber: '',
        bankAccountType: '',
        bankName: 'Bank Transfer'
      }
      const d = (bankAccount && bankAccount.details) || defaultBankInfo
      return `${d.bankName}`
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

export const getPaymentMethodDetails = (
  order: SBOrderType,
  bankAccount: BankTransferAccountType,
  cardDetails: SBCardType | null
) => {
  switch (order.paymentType) {
    case SBPaymentTypes.PAYMENT_CARD:
      return `${cardDetails?.card?.type} ${cardDetails?.card?.number}`
    case SBPaymentTypes.BANK_TRANSFER:
      const defaultBankInfo = {
        accountNumber: '',
        bankAccountType: '',
        bankName: 'Bank Transfer'
      }
      const d = (bankAccount && bankAccount.details) || defaultBankInfo
      return `${d.bankAccountType?.toLowerCase() || ''} ${d.accountNumber || ''}`
    default:
      return null
  }
}
