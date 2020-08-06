import {
  CARD_TYPES,
  DEFAULT_CARD_SVG_LOGO
} from 'components/Form/CreditCardBox/model'
import { FlyoutWrapper } from 'components/Flyout'
import { Form, InjectedFormProps, reduxForm } from 'redux-form'
import { FormattedMessage } from 'react-intl'
import { Icon, Text } from 'blockchain-info-components'
import { Props as OwnProps, SuccessStateType } from '../index'
import {
  SBPaymentMethodType,
  WalletCurrencyType,
  WalletFiatEnum
} from 'core/types'
import BankAccount from './BankAccount'
import Card from './Card'
import Fund from './Fund'
import PaymentCard from './PaymentCard'
import React, { PureComponent, ReactElement } from 'react'
import styled from 'styled-components'

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
  border-top: 1px solid ${props => props.theme.grey000};
`
const IconContainer = styled.div`
  width: 38px;
  height: 38px;
  border-radius: 50%;
  background-color: ${props => props.theme.blue000};
  display: flex;
  align-items: center;
  justify-content: center;
`

export type Props = OwnProps & SuccessStateType

class Payments extends PureComponent<InjectedFormProps<{}, Props> & Props> {
  getType = (value: SBPaymentMethodType) => {
    switch (value.type) {
      case 'BANK_ACCOUNT':
        return 'Deposit Cash'
      case 'PAYMENT_CARD':
        return 'Add a Credit or Debit Card'
      case 'USER_CARD':
        return value && value.card
          ? value.card.label
            ? value.card.label
            : value.card.type
          : 'Add a Credit or Debit Card'
      case 'FUNDS':
        return ''
    }
  }

  handleSubmit = (method: SBPaymentMethodType) => {
    this.props.simpleBuyActions.handleSBMethodChange(method)
  }

  getIcon = (value: SBPaymentMethodType): ReactElement => {
    switch (value.type) {
      case 'BANK_ACCOUNT':
        return (
          <IconContainer>
            <Icon size='18px' color='blue600' name='arrow-down' />
          </IconContainer>
        )
      case 'PAYMENT_CARD':
        return (
          <IconContainer>
            <Icon size='18px' color='blue600' name='credit-card' />
          </IconContainer>
        )
      case 'USER_CARD':
        const { card } = value
        if (!card) {
          return <></>
        }
        const cardType = CARD_TYPES.find(cc => cc.type === card.type)
        return (
          <img
            height='18px'
            width='auto'
            src={cardType ? cardType.logo : DEFAULT_CARD_SVG_LOGO}
          />
        )
      case 'FUNDS':
        return (
          <Icon
            size='30px'
            color='fiat'
            name={value.currency.toLowerCase() as 'eur' | 'gbp'}
          />
        )
    }
  }

  renderCardText = (value: SBPaymentMethodType): string => {
    return value.card
      ? value.card.label
        ? value.card.label
        : value.card.type
      : 'Credit or Debit Card'
  }

  render () {
    const { fiatCurrency, orderType } = this.props
    const availableCards = this.props.cards.filter(
      card => card.state === 'ACTIVE' && orderType === 'BUY'
    )
    const defaultMethods = this.props.paymentMethods.methods.map(value => ({
      text: this.getType(value),
      value
    }))

    const defaultCardMethod = this.props.paymentMethods.methods.find(
      m => m.type === 'PAYMENT_CARD' && orderType === 'BUY'
    )

    const funds = defaultMethods.filter(
      method =>
        method.value.type === 'FUNDS' &&
        method.value.currency in WalletFiatEnum &&
        method.value.currency === this.props.fiatCurrency &&
        Number(
          this.props.balances[method.value.currency as WalletCurrencyType]
            ?.available
        ) > 0
    )

    const paymentCard = defaultMethods.find(
      method => method.value.type === 'PAYMENT_CARD' && orderType === 'BUY'
    )
    const bankAccount = defaultMethods.find(
      method => method.value.type === 'BANK_ACCOUNT'
    )

    const cardMethods = availableCards.map(card => ({
      text: card.card
        ? card.card.label
          ? card.card.label
          : card.card.type
        : 'Credit or Debit Card',
      value: {
        ...card,
        card: card.card,
        type: 'USER_CARD',
        currency: card.currency,
        limits:
          defaultCardMethod && defaultCardMethod.limits
            ? defaultCardMethod.limits
            : { min: '1000', max: '500000' }
      } as SBPaymentMethodType
    }))

    return (
      <Wrapper>
        <Form>
          <FlyoutWrapper>
            <TopText color='grey800' size='20px' weight={600}>
              <Icon
                cursor
                name='arrow-left'
                size='20px'
                color='grey600'
                style={{ marginRight: '28px' }}
                role='button'
                onClick={() =>
                  this.props.simpleBuyActions.setStep({
                    step: 'ENTER_AMOUNT',
                    fiatCurrency: this.props.fiatCurrency || 'USD',
                    pair: this.props.pair
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
            {funds &&
              funds.map((fund, index) => (
                <Fund
                  key={`${fund.text}-${index}`}
                  value={fund.value}
                  icon={this.getIcon(fund.value)}
                  onClick={() => this.handleSubmit(fund.value)}
                  balances={
                    this.props.balances[fund.value.currency] || {
                      available: '0',
                      pending: '0'
                    }
                  }
                  walletCurrency={this.props.walletCurrency}
                />
              ))}
            {cardMethods &&
              cardMethods.map((cardMethod, index) => (
                <Card
                  key={`${cardMethod.text}-${index}`}
                  value={cardMethod.value}
                  text={this.renderCardText(cardMethod.value)}
                  icon={this.getIcon(cardMethod.value)}
                  onClick={() => this.handleSubmit(cardMethod.value)}
                />
              ))}
            {paymentCard && (
              <PaymentCard
                key={`${paymentCard.text}`}
                {...paymentCard}
                icon={this.getIcon(paymentCard.value)}
                onClick={() => this.handleSubmit(paymentCard.value)}
              />
            )}
            {bankAccount && fiatCurrency && (
              <BankAccount
                key={`${bankAccount.text}`}
                {...bankAccount}
                icon={this.getIcon(bankAccount.value)}
                onClick={() => this.handleSubmit(bankAccount.value)}
              />
            )}
          </PaymentsWrapper>
        </Form>
      </Wrapper>
    )
  }
}

export default reduxForm<{}, Props>({
  form: 'sbPaymentMethods',
  destroyOnUnmount: false
})(Payments)
