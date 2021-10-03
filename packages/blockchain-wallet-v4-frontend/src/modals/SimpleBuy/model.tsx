import React from 'react'
import { FormattedMessage } from 'react-intl'

import { Link, Text } from 'blockchain-info-components'
import { fiatToString } from 'blockchain-wallet-v4/src/exchange/utils'
import {
  CoinType,
  FiatType,
  SBCardType,
  SBOrderActionType,
  SBOrderType,
  SBPaymentTypes
} from 'blockchain-wallet-v4/src/types'
import { convertBaseToStandard } from 'data/components/exchange/services'
import { getBaseCurrency, getCounterCurrency, getOrderType } from 'data/components/simpleBuy/model'
import { BankTransferAccountType } from 'data/types'

export const ErrorCodeMappings = ({ code }: { code: number | string }) => {
  switch (code) {
    case 41:
      return <FormattedMessage id='error.below_min' defaultMessage='Order below min size limit' />
    case 43:
      return <FormattedMessage id='error.above_max' defaultMessage='Order above max size limit' />
    case 45:
      return (
        <FormattedMessage
          id='error.exceeded_daily'
          defaultMessage="You've reached your daily trading limit"
        />
      )
    case 46:
      return (
        <FormattedMessage
          id='error.exceeded_weekly'
          defaultMessage="You've reached your weekly trading limit"
        />
      )
    case 47:
      return (
        <FormattedMessage
          id='error.exceeded_annual'
          defaultMessage="You've reached your annual trading limit"
        />
      )
    case 51:
      return (
        <FormattedMessage
          id='error.trading_disabled'
          defaultMessage='Trading is temporarily disabled'
        />
      )
    case 53:
      return (
        <FormattedMessage id='error.pending_limit' defaultMessage='Pending orders limit reached' />
      )
    case 93:
      return <FormattedMessage id='error.invalid_address' defaultMessage='Invalid crypto address' />
    case 94:
      return <FormattedMessage id='error.invalid_crypto' defaultMessage='Invalid crypto currency' />
    case 131:
      return (
        <FormattedMessage id='error.insufficient_balance' defaultMessage='Insufficient balance' />
      )
    case 149:
      return <FormattedMessage id='error.invalid_fiat' defaultMessage='Invalid fiat currency' />
    case 151:
      return (
        <FormattedMessage
          id='error.disabled_direction'
          defaultMessage='Order direction is disabled'
        />
      )
    case 152:
      return (
        <FormattedMessage id='error.pending_withdrawal' defaultMessage='Pending withdrawal locks' />
      )
    case 155:
      return <FormattedMessage id='error.invalid_quote' defaultMessage='Invalid or expired quote' />
    case 156:
      return (
        <FormattedMessage id='error.swap_eligibility' defaultMessage='User not eligible for Swap' />
      )
    case 157:
      return (
        <FormattedMessage
          id='error.negative_amount'
          defaultMessage='Destination amount is negative'
        />
      )
    default:
      // If the error form the api is a string like a `description` or `message` just pipe it to the
      // UI else if its a numeric code that's not supported here show a default error message
      return typeof code === 'string' ? (
        <Text>{code}</Text>
      ) : (
        <FormattedMessage id='copy.unkown_error' defaultMessage='An unknown error has occurred.' />
      )
  }
}

export default ErrorCodeMappings

export const BuyOrSell = (props: {
  crypto?: 'Crypto' | CoinType
  orderType: SBOrderActionType
}) => {
  if (props.crypto) {
    return props.orderType === 'BUY' ? (
      <FormattedMessage
        id='buttons.buy_coin'
        defaultMessage='Buy {displayName}'
        values={{
          displayName: props.crypto === 'Crypto' ? 'Crypto' : props.crypto
        }}
      />
    ) : (
      <FormattedMessage
        id='buttons.sell_coin'
        defaultMessage='Sell {displayName}'
        values={{ displayName: props.crypto }}
      />
    )
  }

  return props.orderType === 'BUY' ? (
    <FormattedMessage id='buttons.buy' defaultMessage='Buy' />
  ) : (
    <FormattedMessage id='buttons.sell' defaultMessage='Sell' />
  )
}

export const getOrderDestination = (order: SBOrderType) => {
  const orderType = getOrderType(order)
  const baseCurrency = getBaseCurrency(order)
  const counterCurrency = getCounterCurrency(order)

  return orderType === 'BUY' ? `${baseCurrency} Trading Account` : `${counterCurrency} Account`
}

export const getPaymentMethod = (order: SBOrderType, bankAccount: BankTransferAccountType) => {
  const baseCurrency = getBaseCurrency(order)
  const counterCurrency = getCounterCurrency(order)
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

export const displayFiat = (order: SBOrderType, amt: string) => {
  const counterCurrency = getCounterCurrency(order)

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
      return `${cardDetails?.card?.type || ''} ${cardDetails?.card?.number || ''}`
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

export const getLockRuleMessaging = (
  showLockRule: boolean,
  days: number,
  paymentType?: SBPaymentTypes
) => {
  switch (paymentType) {
    case SBPaymentTypes.BANK_TRANSFER:
    case SBPaymentTypes.PAYMENT_CARD:
    case SBPaymentTypes.USER_CARD:
      if (showLockRule) {
        return (
          <>
            <Text size='12px' weight={500} color='grey900'>
              <FormattedMessage
                id='modals.simplebuy.summary.complete_card_info_main'
                defaultMessage='Your final amount might change due to market activity. For security purposes, a {days} holding period will be applied to your funds. You can Sell or Swap during this time. We will notify you once the funds are available to be withdrawn.'
                values={{ days }}
              />
            </Text>
            <Link
              href='https://support.blockchain.com/hc/en-us/articles/360051018131-Trading-Account-Withdrawal-Holds'
              size='14px'
              rel='noopener noreferrer'
              target='_blank'
            >
              <FormattedMessage
                id='modals.simplebuy.summary.learn_more'
                defaultMessage='Learn more'
              />
            </Link>
          </>
        )
      }
      return (
        <Text size='12px' weight={500} color='grey900'>
          <FormattedMessage
            id='modals.simplebuy.confirm.activity_card11'
            defaultMessage='Your final amount might change due to market activity. Your funds will be available to Sell, Swap or withdraw instantly.'
          />
        </Text>
      )

    case SBPaymentTypes.FUNDS:
    default:
      return (
        <Text size='12px' weight={500} color='grey900'>
          <FormattedMessage
            id='modals.simplebuy.confirm.activity'
            defaultMessage='Your final amount may change due to market activity.'
          />
        </Text>
      )
  }
}
