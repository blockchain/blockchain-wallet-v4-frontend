import React, { ReactNode, useCallback, useEffect, useState } from 'react'
import { FormattedMessage } from 'react-intl'
import { useDispatch } from 'react-redux'
import { Form, reduxForm } from 'redux-form'

import {
  BSPaymentMethodType,
  BSPaymentTypes,
  FiatType,
  MobilePaymentType,
  OrderType,
  WalletCurrencyType,
  WalletFiatEnum,
  WalletFiatType
} from '@core/types'
import { Icon, Image, Text } from 'blockchain-info-components'
import { AddNewButton } from 'components/Brokerage'
import { Divider } from 'components/Divider'
import { FlyoutWrapper } from 'components/Flyout'
import { GenericNabuErrorCard } from 'components/GenericNabuErrorCard'
import { Padding } from 'components/Padding'
import { trackEvent } from 'data/analytics/slice'
import { Analytics } from 'data/analytics/types'
import { buySell } from 'data/components/actions'
import { getCoinFromPair, getFiatFromPair } from 'data/components/buySell/model'
import { getEnterAmountStepType } from 'data/components/buySell/utils'
import { BSCardStateEnum } from 'data/types'

import { PaymentMethodsProps } from '../index'
import { getData } from '../selectors'
import { NoMethods, PaymentsWrapper, TopText, Wrapper } from './AccountsStyles'
import Bank from './Bank'
import Card from './Card'
import Fund from './Fund'
import { getIcon, getLinkedBankIcon, getType, renderBankText, renderCardText } from './helpers'
import MobilePayment from './MobilePayment'

export type Props = PaymentMethodsProps &
  ReturnType<typeof getData>['data'] & {
    fiatCurrency: undefined | FiatType
  }

const Accounts = ({
  applePayEnabled,
  balances,
  bankTransferAccounts,
  cards,
  fiatCurrency,
  googlePayEnabled,
  isInternalTester,
  orderType,
  pair,
  paymentMethods,
  userData,
  walletCurrency
}: Props) => {
  const dispatch = useDispatch()
  const [applePayAvailable, setApplePayAvailable] = useState(false)
  const [googlePayAvailable, setGooglePayAvailable] = useState(false)
  const [card, setCard] = useState<ReactNode | undefined>()

  const clearCard = useCallback(() => setCard(undefined), [])

  const addCard = useCallback((card: ReactNode) => setCard(card), [])

  const handlePaymentMethodSelect = ({
    method,
    mobilePaymentMethod
  }: {
    method: BSPaymentMethodType
    mobilePaymentMethod?: MobilePaymentType
  }) => {
    dispatch(
      trackEvent({
        key: Analytics.BUY_PAYMENT_METHOD_CHANGED,
        properties: {
          payment_type: method.type
        }
      })
    )

    dispatch(buySell.handleMethodChange({ isFlow: false, method, mobilePaymentMethod }))
  }

  const addNewPaymentMethod = () => {
    dispatch(
      trackEvent({
        key: Analytics.BUY_PAYMENT_METHOD_ADD_NEW_CLICKED,
        properties: {}
      })
    )

    if (fiatCurrency) {
      dispatch(
        buySell.setStep({
          cryptoCurrency: getCoinFromPair(pair.pair),
          fiatCurrency,
          pair,
          step: 'PAYMENT_METHODS'
        })
      )
    }
  }

  const availableBankAccounts = bankTransferAccounts.filter(
    (account) => account.state === BSCardStateEnum.ACTIVE && orderType === OrderType.BUY
  )
  const availableCards = cards.filter(
    (card) => card.state === BSCardStateEnum.ACTIVE && orderType === OrderType.BUY
  )

  const defaultMethods = paymentMethods.methods.map((value) => ({
    text: getType(value),
    value
  }))

  const bankTransfer = defaultMethods.find(
    (method) => method.value.type === BSPaymentTypes.BANK_TRANSFER && orderType === OrderType.BUY
  )

  const fiatCurrencies = userData.currencies.userFiatCurrencies
  const funds = defaultMethods.filter(
    (method) =>
      method.value.type === BSPaymentTypes.FUNDS &&
      method.value.currency in WalletFiatEnum &&
      (orderType === OrderType.SELL ||
        Number(balances[method.value.currency as WalletCurrencyType]?.available) > 0) &&
      // for sell we should show only userFiatCurrencies currencies
      (orderType === OrderType.BUY ||
        (orderType === OrderType.SELL &&
          fiatCurrencies.includes(method.value.currency as WalletFiatType)))
  )

  // use this to get min/max for card buys from eligible/payment-methods
  // limits aren't available on availableCards
  const cardMethod = defaultMethods.find(
    (method) => method.value.type === BSPaymentTypes.PAYMENT_CARD
  )
  const cardMethods = availableCards.map((card) => ({
    text: card.card ? card.card.label ?? card.card.type : 'Credit or Debit Card',
    value: {
      ...card,
      card: card.card,
      currency: card.currency,
      limits: {
        max: cardMethod?.value.limits.max ?? '50000',
        min: cardMethod?.value.limits.min ?? '10000'
      },
      type: BSPaymentTypes.USER_CARD
    } as BSPaymentMethodType
  }))

  const bankMethods = availableBankAccounts.map((account) => ({
    text: account.details ? (
      account.details.accountName ?? account.details.accountNumber
    ) : (
      <FormattedMessage id='copy.bank_account' defaultMessage='Bank Account' />
    ),
    value: {
      ...account,
      currency: account.currency,
      limits: bankTransfer?.value?.limits ?? {
        max: '200000',
        min: '100'
      },
      type: BSPaymentTypes.BANK_TRANSFER
    } as BSPaymentMethodType
  }))

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

  const availableMethods =
    funds.length || cardMethods.length || bankMethods.length || !!applePay || !!googlePay

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
    <Form>
      <Wrapper>
        <FlyoutWrapper style={{ flexShrink: 0 }}>
          <TopText color='grey800' size='20px' weight={600}>
            <Icon
              cursor
              name='arrow-back'
              size='20px'
              color='grey600'
              style={{ marginRight: '28px' }}
              role='button'
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
            />
            <div>
              <FormattedMessage id='modals.simplebuy.payusing' defaultMessage='Pay Using' />
            </div>
          </TopText>
        </FlyoutWrapper>
        <PaymentsWrapper>
          {!availableMethods && (
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

          {funds
            ? funds.map((fund, index) => (
                <Fund
                  // eslint-disable-next-line react/no-array-index-key
                  key={`${fund.text}-${index}`}
                  value={fund.value}
                  icon={getIcon(fund.value)}
                  onClick={() => handlePaymentMethodSelect({ method: fund.value })}
                  balances={
                    balances[fund.value.currency] ?? {
                      available: '0',
                      pending: '0',
                      withdrawable: '0'
                    }
                  }
                  walletCurrency={walletCurrency}
                />
              ))
            : null}

          {applePay && applePayAvailable ? (
            <MobilePayment
              type='apple'
              onClick={() => {
                handlePaymentMethodSelect({
                  method: applePay.value,
                  mobilePaymentMethod: MobilePaymentType.APPLE_PAY
                })
              }}
            />
          ) : null}

          {googlePay && googlePayAvailable ? (
            <MobilePayment
              type='google'
              onClick={() => {
                handlePaymentMethodSelect({
                  method: googlePay.value,
                  mobilePaymentMethod: MobilePaymentType.GOOGLE_PAY
                })
              }}
            />
          ) : null}

          {cardMethods
            ? cardMethods.map((cardMethod, index) => (
                <Card
                  // eslint-disable-next-line react/no-array-index-key
                  key={`${index}-${cardMethod.value?.card?.number}`}
                  value={cardMethod.value}
                  text={renderCardText(cardMethod.value)}
                  icon={getIcon(cardMethod.value)}
                  isBlocked={cardMethod.value?.state === BSCardStateEnum.BLOCKED}
                  onClick={() => handlePaymentMethodSelect({ method: cardMethod.value })}
                  onClickNabuErrorInfo={(error) =>
                    addCard(
                      <GenericNabuErrorCard
                        error={error}
                        variant={cardMethod.value.block ? 'error' : 'warning'}
                        onActionClick={clearCard}
                        onClickClose={clearCard}
                      />
                    )
                  }
                />
              ))
            : null}

          {bankMethods
            ? bankMethods.map((bankMethod, index) => (
                <Bank
                  // eslint-disable-next-line react/no-array-index-key
                  key={index}
                  value={bankMethod.value}
                  text={renderBankText(bankMethod.value)}
                  icon={
                    bankMethod.value.details
                      ? getLinkedBankIcon(bankMethod.value?.details?.bankName)
                      : getIcon(bankMethod.value)
                  }
                  onClick={() => handlePaymentMethodSelect({ method: bankMethod.value })}
                />
              ))
            : null}

          {orderType === OrderType.BUY ? (
            <AddNewButton data-e2e='addNewPaymentMethod' onClick={addNewPaymentMethod}>
              <FormattedMessage id='buttons.add_new' defaultMessage='+ Add New' />
            </AddNewButton>
          ) : null}
        </PaymentsWrapper>

        {card && (
          <div style={{ flexShrink: 0 }}>
            <Divider />
            <Padding horizontal={40} vertical={20}>
              {card}
            </Padding>
          </div>
        )}
      </Wrapper>
    </Form>
  )
}

export default reduxForm<{}, Props>({
  destroyOnUnmount: false,
  form: 'bsPaymentMethods'
})(Accounts)
