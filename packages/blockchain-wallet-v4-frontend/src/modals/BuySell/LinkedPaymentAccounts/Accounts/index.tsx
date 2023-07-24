import React, { ReactElement, useEffect, useState } from 'react'
import { FormattedMessage } from 'react-intl'
import {
  CARD_TYPES,
  DEFAULT_CARD_SVG_LOGO
} from 'blockchain-wallet-v4-frontend/src/modals/BuySell/PaymentMethods/model'
import { Form, reduxForm } from 'redux-form'
import styled from 'styled-components'

import {
  BSPaymentMethodType,
  BSPaymentTypes,
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
import { Analytics } from 'data/analytics/types'
import { getCoinFromPair, getFiatFromPair } from 'data/components/buySell/model'
import { getEnterAmountStepType } from 'data/components/buySell/utils'
import { BSCardStateEnum } from 'data/types'
import { getBankLogoImageName } from 'services/images'

import { Props as OwnProps, SuccessStateType } from '../index'
import ApplePay from './ApplePay'
import Bank from './Bank'
import Card from './Card'
import Fund from './Fund'
import GooglePay from './GooglePay'
import { useCardState } from './hooks'

const Wrapper = styled.div`
  display: flex;
  justify-content: space-between;
  flex-direction: column;
  height: 100vh;
`
const TopText = styled(Text)`
  display: flex;
  align-items: center;
  margin-bottom: 7px;
`
const PaymentsWrapper = styled.div`
  border-top: 1px solid ${(props) => props.theme.grey000};
  flex-grow: 1;
  overflow-y: scroll;
`
const NoMethods = styled(FlyoutWrapper)`
  text-align: center;
`
const IconContainer = styled.div`
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background-color: ${(props) => props.theme.blue000};
  display: flex;
  align-items: center;
  justify-content: center;
`

export type Props = OwnProps & SuccessStateType

const Accounts = (props: Props) => {
  const [isApplePayAvailable, setApplePayAvailable] = useState(false)
  const [isGooglePayAvailable, setGooglePayAvailable] = useState(false)
  const { addCard, card, clearCard } = useCardState()

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
            id='modals.simplebuy.deposit.regular_bank_transfer'
            defaultMessage='Regular Bank Transfer'
          />
        )
      case BSPaymentTypes.PAYMENT_CARD:
        return (
          <FormattedMessage
            id='modals.simplebuy.paymentcard'
            defaultMessage='Credit or Debit Card'
          />
        )
      case BSPaymentTypes.USER_CARD:
        return value && value.card ? (
          value.card.label ? (
            value.card.label
          ) : (
            value.card.type
          )
        ) : (
          <FormattedMessage
            id='modals.simplebuy.paymentcard'
            defaultMessage='Credit or Debit Card'
          />
        )
      case BSPaymentTypes.FUNDS:
      default:
        return ''
    }
  }

  const handlePaymentMethodSelect = ({
    method,
    mobilePaymentMethod
  }: {
    method: BSPaymentMethodType
    mobilePaymentMethod?: MobilePaymentType
  }) => {
    props.analyticsActions.trackEvent({
      key: Analytics.BUY_PAYMENT_METHOD_CHANGED,
      properties: {
        payment_type: method.type
      }
    })

    props.buySellActions.handleMethodChange({ isFlow: false, method, mobilePaymentMethod })
  }

  const addNewPaymentMethod = () => {
    props.analyticsActions.trackEvent({
      key: Analytics.BUY_PAYMENT_METHOD_ADD_NEW_CLICKED,
      properties: {}
    })

    if (props.fiatCurrency) {
      props.buySellActions.setStep({
        cryptoCurrency: getCoinFromPair(props.pair.pair),
        fiatCurrency: props.fiatCurrency,
        pair: props.pair,
        step: 'PAYMENT_METHODS'
      })
    }
  }

  const getLinkedBankIcon = (bankName: string): ReactElement => (
    <Image name={getBankLogoImageName(bankName)} height='48px' />
  )

  const getIcon = (value: BSPaymentMethodType): ReactElement => {
    switch (value.type) {
      case BSPaymentTypes.BANK_TRANSFER:
      case BSPaymentTypes.LINK_BANK:
        return <Image name='bank' height='48px' />
      case BSPaymentTypes.BANK_ACCOUNT:
        return (
          <IconContainer>
            <Icon size='18px' color='blue600' name='arrow-down' />
          </IconContainer>
        )
      case BSPaymentTypes.PAYMENT_CARD:
        return (
          <IconContainer>
            <Icon size='18px' color='blue600' name='credit-card-sb' />
          </IconContainer>
        )
      case BSPaymentTypes.USER_CARD:
        const { card } = value
        if (!card) {
          return <></>
        }
        const cardType = CARD_TYPES.find((cc) => cc.type === card.type)
        return (
          <img
            alt='Credit Card Type'
            height='18px'
            width='auto'
            src={cardType ? cardType.logo : DEFAULT_CARD_SVG_LOGO}
          />
        )
      case BSPaymentTypes.FUNDS:
        return <Icon size='32px' color='USD' name={value.currency as WalletCurrencyType} />
      default:
        return <Image name='blank-card' />
    }
  }

  const renderBankText = (value: BSPaymentMethodType): string | ReactElement => {
    return value.details ? (
      value.details.bankName ? (
        value.details.bankName
      ) : (
        value.details.accountNumber
      )
    ) : (
      <FormattedMessage id='copy.bank_account' defaultMessage='Bank Account' />
    )
  }

  const renderCardText = (value: BSPaymentMethodType): string => {
    return value.card
      ? value.card.label
        ? value.card.label
        : value.card.type
      : 'Credit or Debit Card'
  }

  const { orderType, userData } = props
  const availableBankAccounts = props.bankTransferAccounts.filter(
    (account) => account.state === BSCardStateEnum.ACTIVE && orderType === OrderType.BUY
  )
  const availableCards = props.cards.filter(
    (card) => card.state === BSCardStateEnum.ACTIVE && orderType === OrderType.BUY
  )

  const defaultMethods = props.paymentMethods.methods.map((value) => ({
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
        Number(props.balances[method.value.currency as WalletCurrencyType]?.available) > 0) &&
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
    text: card.card ? (card.card.label ? card.card.label : card.card.type) : 'Credit or Debit Card',
    value: {
      ...card,
      card: card.card,
      currency: card.currency,
      limits: {
        max: cardMethod?.value.limits.max || '50000',
        min: cardMethod?.value.limits.min || '10000'
      },
      type: BSPaymentTypes.USER_CARD
    } as BSPaymentMethodType
  }))

  const bankMethods = availableBankAccounts.map((account) => ({
    text: account.details ? (
      account.details.accountName ? (
        account.details.accountName
      ) : (
        account.details.accountNumber
      )
    ) : (
      <FormattedMessage id='copy.bank_account' defaultMessage='Bank Account' />
    ),
    value: {
      ...account,
      currency: account.currency,
      limits: (bankTransfer && bankTransfer.value && bankTransfer.value.limits) || {
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
                props.buySellActions.setStep({
                  cryptoCurrency: getCoinFromPair(props.pair.pair),
                  fiatCurrency: getFiatFromPair(props.pair.pair),
                  orderType: props.orderType,
                  pair: props.pair,
                  step: getEnterAmountStepType(props.orderType)
                })
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
                    props.balances[fund.value.currency] || {
                      available: '0',
                      pending: '0',
                      withdrawable: '0'
                    }
                  }
                  walletCurrency={props.walletCurrency}
                />
              ))
            : null}

          {applePay && isApplePayAvailable ? (
            <ApplePay
              onClick={() => {
                handlePaymentMethodSelect({
                  method: applePay.value,
                  mobilePaymentMethod: MobilePaymentType.APPLE_PAY
                })
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
