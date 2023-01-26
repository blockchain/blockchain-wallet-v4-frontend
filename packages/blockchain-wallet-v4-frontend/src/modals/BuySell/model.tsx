import React, { FC, ReactNode, useState } from 'react'
import { FormattedMessage } from 'react-intl'
import { Button, Padding, Text } from '@blockchain-com/constellation'

import { fiatToString } from '@core/exchange/utils'
import {
  BSCardType,
  BSOrderActionType,
  BSOrderType,
  BSPaymentTypes,
  CoinType,
  FiatType,
  MobilePaymentType
} from '@core/types'
import { Link, TextGroup } from 'blockchain-info-components'
import { getCounterCurrency } from 'data/components/buySell/model'
import { convertBaseToStandard } from 'data/components/exchange/services'
import { BankTransferAccountType } from 'data/types'

const defaultBankInfo = {
  accountNumber: '',
  bankAccountType: '',
  bankName: 'Bank Transfer'
}

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
    case 165:
      return (
        <FormattedMessage
          id='error.sanctioned_country'
          defaultMessage='You are not eligible to perform requested operation because you are from a sanctioned country or state'
        />
      )
    default:
      // If the error form the api is a string like a `description` or `message` just pipe it to the
      // UI else if its a numeric code that's not supported here show a default error message
      return typeof code === 'string' && code !== '{}' ? (
        <Text>{code}</Text>
      ) : (
        <FormattedMessage id='copy.unkown_error' defaultMessage='An unknown error has occurred.' />
      )
  }
}

export default ErrorCodeMappings

export const BuyOrSell = (props: {
  crypto?: 'Crypto' | CoinType
  orderType: BSOrderActionType
}) => {
  if (props.crypto) {
    const coin = window.coins[props.crypto]
    return props.orderType === 'BUY' ? (
      <FormattedMessage
        id='buttons.buy_coin'
        defaultMessage='Buy {displayName}'
        values={{
          displayName:
            props.crypto === 'Crypto' ? 'Crypto' : coin ? coin.coinfig.displaySymbol : props.crypto
        }}
      />
    ) : (
      <FormattedMessage
        id='buttons.sell_coin'
        defaultMessage='Sell {displayName}'
        values={{ displayName: coin ? coin.coinfig.displaySymbol : props.crypto }}
      />
    )
  }

  return props.orderType === 'BUY' ? (
    <FormattedMessage id='buttons.buy' defaultMessage='Buy' />
  ) : (
    <FormattedMessage id='buttons.sell' defaultMessage='Sell' />
  )
}

export const getPaymentMethod = ({
  bankAccount,
  fiatCode,
  mobilePaymentMethod,
  paymentType
}: {
  bankAccount: BankTransferAccountType
  fiatCode: string
  mobilePaymentMethod?: MobilePaymentType
  paymentType: BSPaymentTypes | undefined
}) => {
  if (mobilePaymentMethod === MobilePaymentType.APPLE_PAY) {
    return <FormattedMessage id='buttons.apple_pay' defaultMessage='Apple Pay' />
  }

  if (mobilePaymentMethod === MobilePaymentType.GOOGLE_PAY) {
    return <FormattedMessage id='buttons.google_pay' defaultMessage='Google Pay' />
  }

  switch (paymentType) {
    case BSPaymentTypes.PAYMENT_CARD:
      return (
        <FormattedMessage id='modals.simplebuy.confirm.payment_card' defaultMessage='Credit Card' />
      )
    case BSPaymentTypes.FUNDS:
      return window.coins[fiatCode]?.coinfig.name ?? fiatCode

    case BSPaymentTypes.BANK_TRANSFER:
      const effectiveBankAccount = (bankAccount && bankAccount.details) || defaultBankInfo

      return effectiveBankAccount.bankName
    default:
      return (
        <FormattedMessage
          id='modals.simplebuy.deposit.bank_transfer'
          defaultMessage='Bank Transfer'
        />
      )
  }
}

export const displayFiat = (order: BSOrderType, amt: string) => {
  const counterCurrency = getCounterCurrency(order)

  return fiatToString({
    unit: counterCurrency as FiatType,
    value: convertBaseToStandard('FIAT', amt)
  })
}

export const getPaymentMethodDetails = ({
  bankAccount,
  cardDetails,
  paymentType
}: {
  bankAccount: BankTransferAccountType
  cardDetails: BSCardType | null
  paymentType: BSPaymentTypes | undefined
}) => {
  switch (paymentType) {
    case BSPaymentTypes.PAYMENT_CARD:
      return `${cardDetails?.card?.type || ''} ***${cardDetails?.card?.number || ''}`
    case BSPaymentTypes.BANK_TRANSFER:
      const effectiveBankAccount = (bankAccount && bankAccount.details) || defaultBankInfo
      return `${effectiveBankAccount.bankName || ''} ****${
        effectiveBankAccount.accountNumber || ''
      }`
    default:
      return null
  }
}

const MoreInfoContainer: FC<{ teaser: ReactNode; text: ReactNode }> = ({ teaser, text }) => {
  const [isOpen, setIsOpen] = useState(false)
  const handleClick = (e) => {
    e.preventDefault()
    if (isOpen) {
      setIsOpen(false)
    } else {
      setIsOpen(true)
    }
  }
  return (
    <>
      <Padding bottom={1}>
        <Text as='p' variant='caption1'>
          {teaser}
        </Text>
      </Padding>
      {isOpen && (
        <Text as='p' variant='caption1'>
          {text}
        </Text>
      )}
      <Button
        as='button'
        onClick={handleClick}
        size='small'
        state='initial'
        text={isOpen ? 'Read Less' : 'Read More'}
        type='button'
        variant='minimal'
        width='auto'
      />
    </>
  )
}

export const getLockRuleMessaging = ({
  coin,
  days,
  paymentAccount,
  paymentType,
  quoteRate,
  showLockRule,
  totalAmount,
  withdrawalLockDays
}: {
  coin: string
  days: number
  paymentAccount: string | null
  paymentType?: BSPaymentTypes
  quoteRate: ReactNode
  showLockRule: boolean
  totalAmount: string
  withdrawalLockDays: number
}) => {
  switch (paymentType) {
    case BSPaymentTypes.BANK_TRANSFER:
      return (
        <MoreInfoContainer
          teaser={
            <FormattedMessage
              id='modals.simplebuy.confirm.by_placing_this_order'
              defaultMessage='By placing this order, you authorize Blockchain.com, Inc. to debit {totalAmount} from your bank account for a {coin} purchase at a quoted price of {quoteRate}.'
              values={{ coin, quoteRate, totalAmount }}
            />
          }
          text={
            <>
              <Padding bottom={1}>
                <FormattedMessage
                  id='modals.simplebuy.confirm.you_authorize_blockchain'
                  defaultMessage='You authorize Blockchain.com, Inc. to debit your {paymentAccount} account for up to {totalAmount} via Bank Transfer (ACH) and, if necessary, to initiate credit entries/adjustments for any debits made in error to your account at the financial institution where you hold your account. You acknowledge that the origination of ACH transactions to your account complies with the provisions of U.S. law. You agree that this authorization cannot be revoked.'
                  values={{ paymentAccount, totalAmount }}
                />
              </Padding>
              <Padding bottom={1}>
                <FormattedMessage
                  id='modals.simplebuy.confirm.your_deposit_will_be_credited'
                  defaultMessage='Your deposit will be credited to your Blockchain.com account within 0-4 business days at the rate shown at the time of your purchase. You can withdraw these funds from your Blockchain.com account {withdrawalLockDays} days after Blockchain.com receives funds from your financial institution.'
                  values={{ withdrawalLockDays }}
                />
              </Padding>
            </>
          }
        />
      )
    case BSPaymentTypes.PAYMENT_CARD:
    case BSPaymentTypes.USER_CARD:
      if (days === 0) {
        return (
          <Text as='p' variant='caption1'>
            <FormattedMessage
              id='modals.simplebuy.confirm.activity'
              defaultMessage='Your final amount may change due to market activity.'
            />
          </Text>
        )
      }
      if (showLockRule) {
        return (
          <TextGroup inline>
            <Text as='p' variant='caption1'>
              <FormattedMessage
                id='modals.simplebuy.summary.complete_card_info_main'
                defaultMessage='Your final amount might change due to market activity. For security purposes, a {days} day holding period will be applied to your funds. You can Sell or Swap during this time. We will notify you once the funds are available to be withdrawn.'
                values={{ days }}
              />
            </Text>
            <Link
              href='https://support.blockchain.com/hc/en-us/articles/360051018131-Trading-Account-Withdrawal-Holds'
              size='12px'
              rel='noopener noreferrer'
              target='_blank'
            >
              <FormattedMessage
                id='modals.simplebuy.summary.learn_more'
                defaultMessage='Learn more'
              />
            </Link>
          </TextGroup>
        )
      }
      return (
        <Text as='p' variant='caption1'>
          <FormattedMessage
            id='modals.simplebuy.confirm.activity_card11'
            defaultMessage='Your final amount might change due to market activity. Your funds will be available to Sell, Swap or withdraw instantly.'
          />
        </Text>
      )
    case BSPaymentTypes.BANK_ACCOUNT:
      return <></>
    case BSPaymentTypes.FUNDS:
    default:
      return (
        <Text as='p' variant='caption1'>
          <FormattedMessage
            id='modals.simplebuy.confirm.activity'
            defaultMessage='Your final amount may change due to market activity.'
          />
        </Text>
      )
  }
}
