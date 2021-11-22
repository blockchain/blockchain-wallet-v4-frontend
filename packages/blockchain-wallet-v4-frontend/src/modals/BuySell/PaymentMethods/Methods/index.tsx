import React, { PureComponent, ReactElement } from 'react'
import { FormattedMessage } from 'react-intl'
import { Form, InjectedFormProps, reduxForm } from 'redux-form'
import styled from 'styled-components'

import {
  OrderType,
  BSPaymentMethodType,
  BSPaymentTypes,
  WalletCurrencyType,
  WalletFiatEnum
} from '@core/types'
import { Icon, Image, Text } from 'blockchain-info-components'
import { FlyoutWrapper } from 'components/Flyout'
import { CARD_TYPES, DEFAULT_CARD_SVG_LOGO } from 'components/Form/CreditCardBox/model'
import { getCoinFromPair, getFiatFromPair } from 'data/components/buySell/model'

import { Props as OwnProps, SuccessStateType } from '../index'
import BankWire from './BankWire'
import LinkBank from './LinkBank'
import PaymentCard from './PaymentCard'

const Wrapper = styled.div`
  display: flex;
  justify-content: space-between;
  flex-direction: column;
  height: 100%;
`
const TopText = styled(Text)`
  display: flex;
  align-items: center;
  margin-bottom: 7px;
`
const PaymentsWrapper = styled.div`
  border-top: 1px solid ${(props) => props.theme.grey000};
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

class Methods extends PureComponent<InjectedFormProps<{}, Props> & Props> {
  getType = (value: BSPaymentMethodType) => {
    switch (value.type) {
      case BSPaymentTypes.BANK_TRANSFER:
      case BSPaymentTypes.LINK_BANK:
        return <FormattedMessage id='modals.simplebuy.banklink' defaultMessage='Link a Bank' />
      case BSPaymentTypes.BANK_ACCOUNT:
        return <FormattedMessage id='modals.simplebuy.bankwire' defaultMessage='Wire Transfer' />
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

  handleSubmit = (method: BSPaymentMethodType) => {
    this.props.buySellActions.handleMethodChange({ isFlow: true, method })
  }

  getIcon = (value: BSPaymentMethodType): ReactElement => {
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
            alt='Credit Card Logo'
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

  render() {
    const { fiatCurrency, orderType } = this.props
    const availableCards = this.props.cards.filter(
      (card) => card.state === 'ACTIVE' && orderType === OrderType.BUY
    )

    const defaultMethods = this.props.paymentMethods.methods.map((value) => ({
      text: this.getType(value),
      value
    }))

    const defaultCardMethod = this.props.paymentMethods.methods.find(
      (m) => m.type === BSPaymentTypes.PAYMENT_CARD && orderType === OrderType.BUY
    )

    const funds = defaultMethods.filter(
      (method) =>
        method.value.type === BSPaymentTypes.FUNDS &&
        method.value.currency in WalletFiatEnum &&
        (orderType === OrderType.SELL ||
          Number(this.props.balances[method.value.currency as WalletCurrencyType]?.available) > 0)
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

    const cardMethods = availableCards.map((card) => ({
      text: card.card
        ? card.card.label
          ? card.card.label
          : card.card.type
        : 'Credit or Debit Card',
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

    const availableMethods =
      funds.length || cardMethods.length || paymentCard !== undefined || bankAccount !== undefined

    return (
      <Wrapper>
        <Form>
          <FlyoutWrapper>
            <TopText color='grey800' size='20px' weight={600}>
              <Icon
                cursor
                name='arrow-back'
                size='20px'
                color='grey600'
                style={{ marginRight: '28px' }}
                role='button'
                onClick={() =>
                  this.props.buySellActions.setStep({
                    cryptoCurrency: getCoinFromPair(this.props.pair.pair),
                    fiatCurrency: getFiatFromPair(this.props.pair.pair),
                    orderType: this.props.orderType,
                    pair: this.props.pair,
                    step: 'ENTER_AMOUNT'
                  })
                }
              />
              <div>
                <FormattedMessage
                  id='modals.simplebuy.paymentmethods'
                  defaultMessage='Payment Methods'
                />
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
            {paymentCard && (
              <PaymentCard
                {...paymentCard}
                icon={this.getIcon(paymentCard.value)}
                onClick={() => this.handleSubmit(paymentCard.value)}
              />
            )}
            {bankTransfer && (
              <LinkBank
                {...bankTransfer}
                // @ts-ignore
                icon={this.getIcon({ type: BSPaymentTypes.BANK_TRANSFER })}
                onClick={() =>
                  this.handleSubmit({
                    ...bankTransfer.value,
                    type: BSPaymentTypes.LINK_BANK
                  })
                }
              />
            )}
            {bankAccount && fiatCurrency && (
              <>
                <BankWire
                  {...bankAccount}
                  icon={this.getIcon(bankAccount.value)}
                  onClick={() => this.handleSubmit(bankAccount.value)}
                />
              </>
            )}
          </PaymentsWrapper>
        </Form>
      </Wrapper>
    )
  }
}

export default reduxForm<{}, Props>({
  destroyOnUnmount: false,
  form: 'sbPaymentMethods'
})(Methods)
