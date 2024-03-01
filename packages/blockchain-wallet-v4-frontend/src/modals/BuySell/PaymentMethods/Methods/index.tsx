import React, { useCallback, useEffect, useState } from 'react'
import { FormattedMessage } from 'react-intl'
import { useDispatch } from 'react-redux'
import { getIcon } from 'blockchain-wallet-v4-frontend/src/modals/BuySell/PaymentMethods/model'

import {
  BSPaymentMethodType,
  BSPaymentTypes,
  MobilePaymentType,
  OrderType,
  WalletCurrencyType,
  WalletFiatEnum
} from '@core/types'
import { Image, Text } from 'blockchain-info-components'
import { FlyoutContainer, FlyoutContent, FlyoutHeader } from 'components/Flyout/Layout'
import { Padding } from 'components/Padding'
import { buySell } from 'data/components/actions'
import { getCoinFromPair, getFiatFromPair } from 'data/components/buySell/model'
import { getEnterAmountStepType } from 'data/components/buySell/utils'
import { useSardineContext } from 'hooks'

import { LinkStatePropsType, Props as OwnProps } from '../index'
import { getType } from '../utils/getType'
import { BankWireCard } from './BankWireCard'
import LinkBank from './LinkBank'
import { NoMethods, PaymentsWrapper } from './Methods.styles'
import MobileMethod from './MobileMethod'
import PaymentCard from './PaymentCard'

export type Props = OwnProps & LinkStatePropsType

const Methods = ({
  applePayEnabled,
  balances,
  cards,
  googlePayEnabled,
  isInternalTester,
  orderType,
  pair,
  paymentMethods
}: Props) => {
  const [applePayAvailable, setApplePayAvailable] = useState(false)
  const [googlePayAvailable, setGooglePayAvailable] = useState(false)
  const [sardineContextIsReady, sardineContext] = useSardineContext('MOBILE_WALLET_DEPOSIT')
  const dispatch = useDispatch()

  const handlePaymentMethodSelect = useCallback(
    ({
      method,
      mobilePaymentMethod
    }: {
      method: BSPaymentMethodType
      mobilePaymentMethod?: MobilePaymentType
    }) => {
      dispatch(buySell.handleMethodChange({ isFlow: true, method, mobilePaymentMethod }))
    },
    []
  )

  const availableCards = cards.filter(
    (card) => card.state === 'ACTIVE' && orderType === OrderType.BUY
  )

  const defaultMethods = paymentMethods.methods.map((value) => ({
    text: getType(value),
    value
  }))

  const defaultCardMethod = paymentMethods.methods.find(
    (m) => m.type === BSPaymentTypes.PAYMENT_CARD && orderType === OrderType.BUY
  )

  const funds = defaultMethods.filter(
    (method) =>
      method.value.type === BSPaymentTypes.FUNDS &&
      method.value.currency in WalletFiatEnum &&
      (orderType === OrderType.SELL ||
        Number(balances[method.value.currency as WalletCurrencyType]?.available) > 0)
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
    text: card.card ? card.card.label ?? card.card.type : 'Credit or Debit Card',
    value: {
      ...card,
      card: card.card,
      currency: card.currency,
      limits: defaultCardMethod?.limits ?? { max: '500000', min: '1000' },
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
      (window as any)?.ApplePaySession?.canMakePayments() &&
      (applePayEnabled || isInternalTester)
    ) {
      setApplePayAvailable(true)
    }

    if (googlePayEnabled || isInternalTester) {
      setGooglePayAvailable(true)
    }
  }, [applePayEnabled, googlePayEnabled, isInternalTester])

  return (
    <FlyoutContainer>
      <FlyoutHeader
        data-e2e='paymentMethodsBackButton'
        onClick={() =>
          dispatch(
            buySell.setStep({
              cryptoCurrency: getCoinFromPair(pair.pair),
              fiatCurrency: getFiatFromPair(pair.pair),
              orderType,
              pair,
              step: getEnterAmountStepType(orderType)
            })
          )
        }
        mode='back'
      >
        <FormattedMessage id='modals.simplebuy.paymentmethods' defaultMessage='Payment Methods' />
      </FlyoutHeader>
      <FlyoutContent mode='top'>
        {!anyAvailableMethod && (
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
        )}

        <PaymentsWrapper>
          {paymentCard && (
            <PaymentCard
              {...paymentCard}
              icon={getIcon(paymentCard.value)}
              onClick={() => handlePaymentMethodSelect({ method: paymentCard.value })}
            />
          )}
          {applePay && applePayAvailable && (
            <MobileMethod
              type='apple'
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
          )}
          {googlePay && googlePayAvailable && (
            <MobileMethod
              type='google'
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
          )}
          {!!bankTransfer && (
            <LinkBank
              {...bankTransfer}
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
