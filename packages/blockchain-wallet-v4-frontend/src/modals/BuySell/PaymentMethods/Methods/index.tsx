import React, { useCallback, useEffect, useState } from 'react'
import { FormattedMessage } from 'react-intl'
import { getIcon } from 'blockchain-wallet-v4-frontend/src/modals/BuySell/PaymentMethods/model'

import {
  BSPaymentMethodType,
  BSPaymentTypes,
  CardFundSourceType,
  MobilePaymentType,
  OrderType,
  WalletCurrencyType,
  WalletFiatEnum
} from '@core/types'
import { Image, Text } from 'blockchain-info-components'
import { FlyoutContainer, FlyoutContent, FlyoutHeader } from 'components/Flyout/Layout'
import { Padding } from 'components/Padding'
import { getCoinFromPair, getFiatFromPair } from 'data/components/buySell/model'
import { getEnterAmountStepType } from 'data/components/buySell/utils'
import { useSardineContext } from 'hooks'

import { Props as OwnProps, SuccessStateType } from '../index'
import ApplePay from './ApplePay'
import { BankWireCard } from './BankWireCard'
import GooglePay from './GooglePay'
import LinkBank from './LinkBank'
import { NoMethods, PaymentsWrapper } from './Methods.styles'
import PaymentCard from './PaymentCard'

const getType = (value: BSPaymentMethodType) => {
  switch (value.type) {
    case BSPaymentTypes.BANK_TRANSFER:
    case BSPaymentTypes.LINK_BANK:
      return (
        <FormattedMessage
          id='modals.simplebuy.easybanktransfer'
          defaultMessage='Easy Bank Transfer'
        />
      )
    case BSPaymentTypes.BANK_ACCOUNT:
      return value.currency === 'USD' ? (
        <FormattedMessage id='modals.simplebuy.bankwire' defaultMessage='Wire Transfer' />
      ) : (
        <FormattedMessage
          id='modals.simplebuy.deposit.bank_transfer'
          defaultMessage='Bank Transfer'
        />
      )
    case BSPaymentTypes.PAYMENT_CARD:
      if (
        value.cardFundSources?.includes(CardFundSourceType.DEBIT) &&
        !value.cardFundSources?.includes(CardFundSourceType.CREDIT)
      ) {
        return (
          <FormattedMessage id='modals.simplebuy.paymentcard.debit' defaultMessage='Debit Card' />
        )
      }

      if (
        value.cardFundSources?.includes(CardFundSourceType.CREDIT) &&
        !value.cardFundSources?.includes(CardFundSourceType.DEBIT)
      ) {
        return (
          <FormattedMessage id='modals.simplebuy.paymentcard.credit' defaultMessage='Credit Card' />
        )
      }

      return (
        <FormattedMessage
          id='modals.simplebuy.paymentcard.debit_and_credit'
          defaultMessage='Credit or Debit Card'
        />
      )
    case BSPaymentTypes.USER_CARD:
      if (value?.card) {
        if (value.card.label) {
          return value.card.label
        }

        return value.card.type
      }

      if (
        value.cardFundSources?.includes(CardFundSourceType.DEBIT) &&
        !value.cardFundSources?.includes(CardFundSourceType.CREDIT)
      ) {
        return (
          <FormattedMessage id='modals.simplebuy.paymentcard.debit' defaultMessage='Debit Card' />
        )
      }

      if (
        value.cardFundSources?.includes(CardFundSourceType.CREDIT) &&
        !value.cardFundSources?.includes(CardFundSourceType.DEBIT)
      ) {
        return (
          <FormattedMessage id='modals.simplebuy.paymentcard.credit' defaultMessage='Credit Card' />
        )
      }

      return (
        <FormattedMessage
          id='modals.simplebuy.paymentcard.debit_and_credit'
          defaultMessage='Credit or Debit Card'
        />
      )
    case BSPaymentTypes.FUNDS:
    default:
      return ''
  }
}

export type Props = OwnProps & SuccessStateType

const Methods: React.FC<Props> = (props: Props) => {
  const [isApplePayAvailable, setApplePayAvailable] = useState(false)
  const [isGooglePayAvailable, setGooglePayAvailable] = useState(false)
  const [sardineContextIsReady, sardineContext] = useSardineContext('MOBILE_WALLET_DEPOSIT')

  const handlePaymentMethodSelect = useCallback(
    ({
      method,
      mobilePaymentMethod
    }: {
      method: BSPaymentMethodType
      mobilePaymentMethod?: MobilePaymentType
    }) => {
      props.buySellActions.handleMethodChange({ isFlow: true, method, mobilePaymentMethod })
    },
    [props.buySellActions]
  )

  const { orderType } = props

  const availableCards = props.cards.filter(
    (card) => card.state === 'ACTIVE' && orderType === OrderType.BUY
  )

  const defaultMethods = props.paymentMethods.methods.map((value) => ({
    text: getType(value),
    value
  }))

  const defaultCardMethod = props.paymentMethods.methods.find(
    (m) => m.type === BSPaymentTypes.PAYMENT_CARD && orderType === OrderType.BUY
  )

  const funds = defaultMethods.filter(
    (method) =>
      method.value.type === BSPaymentTypes.FUNDS &&
      method.value.currency in WalletFiatEnum &&
      (orderType === OrderType.SELL ||
        Number(props.balances[method.value.currency as WalletCurrencyType]?.available) > 0)
  )

  const paymentCard = defaultMethods.find(
    (method) => method.value.type === BSPaymentTypes.PAYMENT_CARD && orderType === OrderType.BUY
  )
  const bankAccount = defaultMethods.find(
    (method) => method.value.type === BSPaymentTypes.BANK_ACCOUNT && orderType === OrderType.BUY
  )
  const bankTransfer = defaultMethods.find(
    (method) => method.value.type === BSPaymentTypes.BANK_TRANSFER && orderType === OrderType.BUY
  )
  const applePay = defaultMethods.find(
    (method) =>
      method.value.mobilePayment?.includes(MobilePaymentType.APPLE_PAY) &&
      orderType === OrderType.BUY
  )
  const googlePay = defaultMethods.find(
    (method) =>
      method.value.mobilePayment?.includes(MobilePaymentType.GOOGLE_PAY) &&
      orderType === OrderType.BUY
  )

  const cardMethods = availableCards.map((card) => ({
    text: card.card ? (card.card.label ? card.card.label : card.card.type) : 'Credit or Debit Card',
    value: {
      ...card,
      card: card.card,
      currency: card.currency,
      limits:
        defaultCardMethod && defaultCardMethod.limits
          ? defaultCardMethod.limits
          : { max: '500000', min: '1000' },
      type: BSPaymentTypes.USER_CARD
    } as BSPaymentMethodType
  }))

  const anyAvailableMethod =
    funds.length ||
    cardMethods.length ||
    !!paymentCard ||
    !!bankAccount ||
    !!applePay ||
    !!googlePay

  useEffect(() => {
    if (
      (window as any).ApplePaySession &&
      (window as any).ApplePaySession.canMakePayments() &&
      (props.applePayEnabled || props.isInternalTester)
    ) {
      setApplePayAvailable(true)
    }

    if (props.googlePayEnabled || props.isInternalTester) {
      setGooglePayAvailable(true)
    }
  }, [props.applePayEnabled, props.googlePayEnabled, props.isInternalTester])

  return (
    <FlyoutContainer>
      <FlyoutHeader
        data-e2e='paymentMethodsBackButton'
        onClick={() =>
          props.buySellActions.setStep({
            cryptoCurrency: getCoinFromPair(props.pair.pair),
            fiatCurrency: getFiatFromPair(props.pair.pair),
            orderType: props.orderType,
            pair: props.pair,
            step: getEnterAmountStepType(props.orderType)
          })
        }
        mode='back'
      >
        <FormattedMessage id='modals.simplebuy.paymentmethods' defaultMessage='Payment Methods' />
      </FlyoutHeader>
      <FlyoutContent mode='top'>
        {!anyAvailableMethod ? (
          <NoMethods>
            <Image
              height='60px'
              name='world-alert'
              srcset={{ 'world-alert2': '2x', 'world-alert3': '3x' }}
            />
            <Text size='16px' weight={500} style={{ marginTop: '8px' }}>
              <FormattedMessage
                id='copy.no_payment_methods'
                defaultMessage='No payment methods available.'
              />
            </Text>
          </NoMethods>
        ) : null}

        <PaymentsWrapper>
          {paymentCard ? (
            <PaymentCard
              {...paymentCard}
              icon={getIcon(paymentCard.value)}
              onClick={() => handlePaymentMethodSelect({ method: paymentCard.value })}
            />
          ) : null}
          {applePay && isApplePayAvailable ? (
            <ApplePay
              onClick={() => {
                handlePaymentMethodSelect({
                  method: applePay.value,
                  mobilePaymentMethod: MobilePaymentType.APPLE_PAY
                })
                if (sardineContextIsReady) {
                  sardineContext.updateConfig({
                    flow: 'MOBILE_WALLET_DEPOSIT'
                  })
                }
              }}
            />
          ) : null}
          {googlePay && isGooglePayAvailable ? (
            <GooglePay
              onClick={() => {
                handlePaymentMethodSelect({
                  method: googlePay.value,
                  mobilePaymentMethod: MobilePaymentType.GOOGLE_PAY
                })
                if (sardineContextIsReady) {
                  sardineContext.updateConfig({
                    flow: 'MOBILE_WALLET_DEPOSIT'
                  })
                }
              }}
            />
          ) : null}
          {!!bankTransfer && (
            <LinkBank
              {...bankTransfer}
              // @ts-ignore
              icon={getIcon({ type: BSPaymentTypes.BANK_TRANSFER })}
              onClick={() =>
                handlePaymentMethodSelect({
                  method: {
                    ...bankTransfer.value,
                    type: BSPaymentTypes.LINK_BANK
                  }
                })
              }
            />
          )}
          {!!bankAccount && (
            <Padding all={24}>
              <BankWireCard
                {...bankAccount}
                onClick={() => handlePaymentMethodSelect({ method: bankAccount.value })}
              />
            </Padding>
          )}
        </PaymentsWrapper>
      </FlyoutContent>
    </FlyoutContainer>
  )
}

export default Methods
