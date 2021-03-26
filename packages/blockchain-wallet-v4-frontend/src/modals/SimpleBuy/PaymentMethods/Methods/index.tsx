import React, { PureComponent, ReactElement } from 'react'
import { FormattedMessage } from 'react-intl'
import { Form, InjectedFormProps, reduxForm } from 'redux-form'
import styled from 'styled-components'

import { Icon, Image, Text } from 'blockchain-info-components'
import {
  SBPaymentMethodType,
  SupportedFiatType,
  WalletCurrencyType,
  WalletFiatEnum
} from 'blockchain-wallet-v4/src/types'
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

class Methods extends PureComponent<InjectedFormProps<{}, Props> & Props> {
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
      ? value.details.accountName
        ? value.details.accountName
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
        (orderType === 'SELL' ||
          Number(
            this.props.balances[method.value.currency as WalletCurrencyType]
              ?.available
          ) > 0)
    )

    const paymentCard = defaultMethods.find(
      method => method.value.type === 'PAYMENT_CARD' && orderType === 'BUY'
    )
    const bankAccount = defaultMethods.find(
      method => method.value.type === 'BANK_ACCOUNT' && orderType === 'BUY'
    )
    const bankTransfer = defaultMethods.find(
      method => method.value.type === 'BANK_TRANSFER' && orderType === 'BUY'
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

    const availableMethods =
      funds.length ||
      cardMethods.length ||
      paymentCard !== undefined ||
      bankAccount !== undefined

    const canDeposit =
      fiatCurrency &&
      (this.props.supportedCoins[fiatCurrency] as SupportedFiatType)
        ?.availability?.deposit

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
                icon={this.getIcon({ type: 'BANK_TRANSFER' })}
                onClick={() =>
                  this.handleSubmit({
                    ...bankTransfer.value,
                    type: 'LINK_BANK'
                  })
                }
              />
            )}
            {bankAccount && fiatCurrency && canDeposit && (
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
  form: 'sbPaymentMethods',
  destroyOnUnmount: false
})(Methods)
