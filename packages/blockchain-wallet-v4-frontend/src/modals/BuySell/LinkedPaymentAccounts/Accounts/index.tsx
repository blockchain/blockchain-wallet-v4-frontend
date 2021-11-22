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
import { AddNewButton } from 'components/Brokerage'
import { FlyoutWrapper } from 'components/Flyout'
import { CARD_TYPES, DEFAULT_CARD_SVG_LOGO } from 'components/Form/CreditCardBox/model'
import { getCoinFromPair, getFiatFromPair } from 'data/components/buySell/model'
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

class Accounts extends PureComponent<InjectedFormProps<{}, Props> & Props> {
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
    this.props.buySellActions.handleMethodChange({ isFlow: false, method })
  }

  addNewPaymentMethod = () => {
    if (this.props.fiatCurrency) {
      this.props.buySellActions.setStep({
        cryptoCurrency: getCoinFromPair(this.props.pair.pair),
        fiatCurrency: this.props.fiatCurrency,
        order: this.props.order,
        pair: this.props.pair,
        step: 'PAYMENT_METHODS'
      })
    }
  }

  getLinkedBankIcon = (bankName: string): ReactElement => (
    <Image name={getBankLogoImageName(bankName)} height='48px' />
  )

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

  renderBankText = (value: BSPaymentMethodType): string | ReactElement => {
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

  renderCardText = (value: BSPaymentMethodType): string => {
    return value.card
      ? value.card.label
        ? value.card.label
        : value.card.type
      : 'Credit or Debit Card'
  }

  render() {
    const { orderType } = this.props
    const availableBankAccounts = this.props.bankTransferAccounts.filter(
      (account) => account.state === 'ACTIVE' && orderType === OrderType.BUY
    )
    const availableCards = this.props.cards.filter(
      (card) => card.state === 'ACTIVE' && orderType === OrderType.BUY
    )

    const defaultMethods = this.props.paymentMethods.methods.map((value) => ({
      text: this.getType(value),
      value
    }))

    const bankTransfer = defaultMethods.find(
      (method) => method.value.type === BSPaymentTypes.BANK_TRANSFER && orderType === OrderType.BUY
    )

    const funds = defaultMethods.filter(
      (method) =>
        method.value.type === BSPaymentTypes.FUNDS &&
        method.value.currency in WalletFiatEnum &&
        (orderType === OrderType.SELL ||
          Number(this.props.balances[method.value.currency as WalletCurrencyType]?.available) > 0)
    )

    // use this to get min/max for card buys from eligible/payment-methods
    // limits aren't available on availableCards
    const cardMethod = defaultMethods.find(
      (method) => method.value.type === BSPaymentTypes.PAYMENT_CARD
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

    const availableMethods = funds.length || cardMethods.length || bankMethods.length
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
            {funds &&
              funds.map((fund, index) => (
                <Fund
                  // eslint-disable-next-line react/no-array-index-key
                  key={`${fund.text}-${index}`}
                  value={fund.value}
                  icon={this.getIcon(fund.value)}
                  onClick={() => this.handleSubmit(fund.value)}
                  balances={
                    this.props.balances[fund.value.currency] || {
                      available: '0',
                      pending: '0',
                      withdrawable: '0'
                    }
                  }
                  walletCurrency={this.props.walletCurrency}
                />
              ))}
            {cardMethods &&
              cardMethods.map((cardMethod, index) => (
                <Card
                  // eslint-disable-next-line react/no-array-index-key
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
                  // eslint-disable-next-line react/no-array-index-key
                  key={index}
                  value={bankMethod.value}
                  text={this.renderBankText(bankMethod.value)}
                  icon={
                    bankMethod.value.details
                      ? this.getLinkedBankIcon(bankMethod.value?.details?.bankName)
                      : this.getIcon(bankMethod.value)
                  }
                  onClick={() => this.handleSubmit(bankMethod.value)}
                />
              ))}
            {orderType === OrderType.BUY && (
              <AddNewButton data-e2e='addNewPaymentMethod' onClick={this.addNewPaymentMethod}>
                <FormattedMessage id='buttons.add_new' defaultMessage='+ Add New' />
              </AddNewButton>
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
})(Accounts)
