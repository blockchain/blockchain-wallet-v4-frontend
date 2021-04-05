import React, { PureComponent, ReactElement } from 'react'
import { FormattedMessage } from 'react-intl'
import { Form, InjectedFormProps, reduxForm } from 'redux-form'
import styled from 'styled-components'

import { Icon, Image, Text } from 'blockchain-info-components'
import {
  SBPaymentMethodType,
  WalletCurrencyType,
  WalletFiatEnum
} from 'blockchain-wallet-v4/src/types'
import { AddNewButton } from 'components/Brokerage'
import { FlyoutWrapper } from 'components/Flyout'
import {
  CARD_TYPES,
  DEFAULT_CARD_SVG_LOGO
} from 'components/Form/CreditCardBox/model'
import {
  getCoinFromPair,
  getFiatFromPair
} from 'data/components/simpleBuy/model'
import { getBankLogoImageName } from 'services/images'

import { Props as OwnProps, SuccessStateType } from '../index'
import Bank from './Bank'
import Card from './Card'
import Fund from './Fund'

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
const NoMethods = styled(FlyoutWrapper)`
  text-align: center;
`
const IconContainer = styled.div`
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background-color: ${props => props.theme.blue000};
  display: flex;
  align-items: center;
  justify-content: center;
`

export type Props = OwnProps & SuccessStateType

class Accounts extends PureComponent<InjectedFormProps<{}, Props> & Props> {
  getType = (value: SBPaymentMethodType) => {
    switch (value.type) {
      case 'BANK_TRANSFER':
      case 'LINK_BANK':
        return (
          <FormattedMessage
            id='modals.simplebuy.banklink'
            defaultMessage='Link a Bank'
          />
        )
      case 'BANK_ACCOUNT':
        return (
          <FormattedMessage
            id='modals.simplebuy.bankwire'
            defaultMessage='Wire Transfer'
          />
        )
      case 'PAYMENT_CARD':
        return (
          <FormattedMessage
            id='modals.simplebuy.paymentcard'
            defaultMessage='Credit or Debit Card'
          />
        )
      case 'USER_CARD':
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
      case 'FUNDS':
        return ''
    }
  }

  handleSubmit = (method: SBPaymentMethodType) => {
    this.props.simpleBuyActions.handleSBMethodChange(method)
  }

  addNewPaymentMethod = () => {
    if (this.props.fiatCurrency) {
      this.props.simpleBuyActions.setStep({
        fiatCurrency: this.props.fiatCurrency,
        step: 'PAYMENT_METHODS',
        pair: this.props.pair,
        cryptoCurrency: getCoinFromPair(this.props.pair.pair),
        order: this.props.order
      })
    }
  }

  getLinkedBankIcon = (bankName: string): ReactElement => (
    <Image name={getBankLogoImageName(bankName)} height='48px' />
  )

  getIcon = (value: SBPaymentMethodType): ReactElement => {
    switch (value.type) {
      case 'BANK_TRANSFER':
      case 'LINK_BANK':
        return <Image name='bank' height='48px' />
      case 'BANK_ACCOUNT':
        return (
          <IconContainer>
            <Icon size='18px' color='blue600' name='arrow-down' />
          </IconContainer>
        )
      case 'PAYMENT_CARD':
        return (
          <IconContainer>
            <Icon size='18px' color='blue600' name='credit-card-sb' />
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
            size='32px'
            color='USD'
            name={value.currency as WalletCurrencyType}
          />
        )
      default:
        return <Image name='blank-card' />
    }
  }

  renderBankText = (value: SBPaymentMethodType): string => {
    return value.details
      ? value.details.bankName
        ? value.details.bankName
        : value.details.accountNumber
      : 'Bank Account'
  }

  renderCardText = (value: SBPaymentMethodType): string => {
    return value.card
      ? value.card.label
        ? value.card.label
        : value.card.type
      : 'Credit or Debit Card'
  }

  render() {
    const { orderType } = this.props
    const availableBankAccounts = this.props.bankTransferAccounts.filter(
      account => account.state === 'ACTIVE' && orderType === 'BUY'
    )
    const availableCards = this.props.cards.filter(
      card => card.state === 'ACTIVE' && orderType === 'BUY'
    )

    const defaultMethods = this.props.paymentMethods.methods.map(value => ({
      text: this.getType(value),
      value
    }))

    const bankTransfer = defaultMethods.find(
      method => method.value.type === 'BANK_TRANSFER' && orderType === 'BUY'
    )

    const funds = defaultMethods.filter(
      method =>
        method.value.type === 'FUNDS' &&
        method.value.currency in WalletFiatEnum &&
        (orderType === 'SELL' ||
          Number(
            this.props.balances[method.value.currency as WalletCurrencyType]
              ?.available
          ) > 0)
    )

    // use this to get min/max for card buys from eligible/payment-methods
    // limits aren't available on availableCards
    const cardMethod = defaultMethods.find(
      method => method.value.type === 'PAYMENT_CARD'
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
        limits: {
          min: cardMethod?.value.limits.min || '10000',
          max: cardMethod?.value.limits.max || '50000'
        }
      } as SBPaymentMethodType
    }))

    const bankMethods = availableBankAccounts.map(account => ({
      text: account.details
        ? account.details.accountName
          ? account.details.accountName
          : account.details.accountNumber
        : 'Bank Account',
      value: {
        ...account,
        type: 'BANK_TRANSFER',
        currency: account.currency,
        limits: (bankTransfer &&
          bankTransfer.value &&
          bankTransfer.value.limits) || { min: '100', max: '200000' }
      } as SBPaymentMethodType
    }))

    const availableMethods =
      funds.length || cardMethods.length || bankMethods.length
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
                  this.props.simpleBuyActions.setStep({
                    step: 'ENTER_AMOUNT',
                    pair: this.props.pair,
                    orderType: this.props.orderType,
                    cryptoCurrency: getCoinFromPair(this.props.pair.pair),
                    fiatCurrency: getFiatFromPair(this.props.pair.pair)
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
                  key={index}
                  value={cardMethod.value}
                  text={this.renderCardText(cardMethod.value)}
                  icon={this.getIcon(cardMethod.value)}
                  onClick={() => this.handleSubmit(cardMethod.value)}
                />
              ))}
            {bankMethods &&
              bankMethods.map((bankMethod, index) => (
                <Bank
                  key={index}
                  value={bankMethod.value}
                  text={this.renderBankText(bankMethod.value)}
                  icon={
                    bankMethod.value.details
                      ? this.getLinkedBankIcon(
                          bankMethod.value?.details?.bankName
                        )
                      : this.getIcon(bankMethod.value)
                  }
                  onClick={() => this.handleSubmit(bankMethod.value)}
                />
              ))}
            {orderType === 'BUY' && (
              <AddNewButton
                data-e2e='addNewPaymentMethod'
                onClick={this.addNewPaymentMethod}
              >
                <FormattedMessage
                  id='buttons.add_new'
                  defaultMessage='+ Add New'
                />
              </AddNewButton>
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
})(Accounts)
