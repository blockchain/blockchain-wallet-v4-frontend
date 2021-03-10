import React, { useEffect, useState } from 'react'
import { FormattedHTMLMessage, FormattedMessage } from 'react-intl'
import moment from 'moment'
import { defaultTo, filter, path } from 'ramda'
import { InjectedFormProps, reduxForm } from 'redux-form'
import styled from 'styled-components'

import {
  Button,
  CheckBoxInput,
  HeartbeatLoader,
  Icon,
  Text
} from 'blockchain-info-components'
import { fiatToString } from 'blockchain-wallet-v4/src/exchange/currency'
import {
  BankTransferAccountType,
  SupportedWalletCurrenciesType
} from 'blockchain-wallet-v4/src/types'
import { ErrorCartridge } from 'components/Cartridge'
import { FlyoutWrapper, Row, Title, Value } from 'components/Flyout'
import { Form } from 'components/Form'
import {
  getBaseAmount,
  getBaseCurrency,
  getCounterAmount,
  getCounterCurrency,
  getOrderType,
  getPaymentMethodId
} from 'data/components/simpleBuy/model'

import { displayFiat, getPaymentMethod } from '../model'
import { Props as OwnProps, SuccessStateType } from '.'

const CustomForm = styled(Form)`
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
`
const TopText = styled(Text)`
  display: flex;
  align-items: center;
`
const Bottom = styled(FlyoutWrapper)`
  display: flex;
  flex-direction: column;
  padding-top: 30px;
  height: 100%;
  border-top: 1px solid ${props => props.theme.grey000};
`
const Info = styled.div`
  display: flex;
  align-items: center;
`
const InfoTerms = styled(Text)`
  display: flex;
  flex-direction: row;
  margin-top: 16px;
  a {
    color: ${props => props.theme.blue600};
    cursor: pointer;
    text-decoration: none;
  }
`
const Amount = styled.div`
  margin-top: 40px;
  > div {
    display: inline;
  }
`

const Success: React.FC<InjectedFormProps<{}, Props> & Props> = props => {
  const [acceptTerms, setAcceptTerms] = useState(false)
  const orderType = getOrderType(props.order)
  const baseAmount = getBaseAmount(props.order)
  const baseCurrency = getBaseCurrency(props.order, props.supportedCoins)
  const counterAmount = getCounterAmount(props.order)
  const counterCurrency = getCounterCurrency(props.order, props.supportedCoins)
  const paymentMethodId = getPaymentMethodId(props.order)
  const requiresTerms =
    props.order.paymentType === 'PAYMENT_CARD' ||
    props.order.paymentType === 'USER_CARD'
  const [bankAccount] = filter(
    (b: BankTransferAccountType) =>
      b.state === 'ACTIVE' && b.id === paymentMethodId,
    defaultTo([])(path(['bankAccounts'], props))
  )
  const showLock = props.withdrawLockCheck && props.withdrawLockCheck.lockTime
  const isBankLink = props.order.paymentType === 'BANK_TRANSFER'

  const days =
    props.withdrawLockCheck && props.withdrawLockCheck.lockTime
      ? moment.duration(props.withdrawLockCheck.lockTime, 'seconds').days()
      : 3

  useEffect(() => {
    if (!requiresTerms) {
      return setAcceptTerms(true)
    }
  }, [])

  const handleCancel = () => {
    props.simpleBuyActions.cancelSBOrder(props.order)
  }

  return (
    <CustomForm onSubmit={props.handleSubmit}>
      <FlyoutWrapper>
        <TopText color='grey800' size='20px' weight={600}>
          <Icon
            cursor
            name='arrow-left'
            size='20px'
            color='grey600'
            style={{ marginRight: '24px' }}
            role='button'
            onClick={handleCancel}
          />
          <FormattedMessage
            id='modals.simplebuy.checkoutconfirm'
            defaultMessage='Checkout'
          />
        </TopText>
        <Amount data-e2e='sbTotalAmount'>
          <Text size='32px' weight={600} color='grey800'>
            {baseAmount}
          </Text>
          <Text size='32px' weight={600} color='grey800'>
            {baseCurrency}
          </Text>
        </Amount>
      </FlyoutWrapper>
      <Row>
        <Title>
          <FormattedMessage
            id='modals.simplebuy.confirm.coin_price'
            defaultMessage='{coin} Price'
            values={{
              coin: baseCurrency
            }}
          />
        </Title>
        <Value data-e2e='sbExchangeRate'>
          {displayFiat(props.order, props.supportedCoins, props.quote.rate)}
        </Value>
      </Row>
      <Row>
        <Title>
          <FormattedMessage id='copy.fee' defaultMessage='Fee' />
        </Title>
        <Value>
          {props.order.fee
            ? displayFiat(props.order, props.supportedCoins, props.order.fee)
            : `${displayFiat(
                props.order,
                props.supportedCoins,
                props.quote.fee
              )} ${props.order.inputCurrency}`}
        </Value>
      </Row>
      <Row>
        <Title>
          <FormattedMessage id='copy.total' defaultMessage='Total' />
        </Title>
        <Value data-e2e='sbFiatBuyAmount'>
          {fiatToString({ value: counterAmount, unit: counterCurrency })}
        </Value>
      </Row>
      <Row>
        <Title>
          <FormattedMessage
            id='modals.simplebuy.confirm.payment'
            defaultMessage='Payment Method'
          />
        </Title>
        <Value>
          {getPaymentMethod(props.order, props.supportedCoins, bankAccount)}
        </Value>
      </Row>
      <Bottom>
        {requiresTerms ? (
          <Info style={{ marginBottom: '12px' }}>
            <Icon
              name='market-up'
              color='grey900'
              size='16px'
              style={{ marginRight: '8px' }}
            />
            <Text size='12px' weight={500} color='grey900'>
              <FormattedHTMLMessage
                id='modals.simplebuy.confirm.activity_card1'
                defaultMessage='Your final amount might change due to market activity.'
              />
            </Text>
          </Info>
        ) : (
          <Info style={{ marginBottom: '12px' }}>
            <Icon
              name='info'
              color='grey900'
              size='16px'
              style={{ marginRight: '8px' }}
            />
            <Text size='12px' weight={500} color='grey900'>
              <FormattedMessage
                id='modals.simplebuy.confirm.activity'
                defaultMessage='Your final amount may change due to market activity.'
              />
            </Text>
          </Info>
        )}
        {showLock && props.order.paymentType === 'USER_CARD' && (
          <Info>
            <Icon
              name='info'
              color='grey900'
              size='16px'
              style={{ marginRight: '8px' }}
            />
            <Text size='12px' weight={500} color='grey900'>
              <FormattedHTMLMessage
                id='modals.simplebuy.confirm.activity_card2'
                defaultMessage='Your crypto will be available to be withdrawn within <b>{days} days</b>.'
                values={{ days: days }}
              />
            </Text>
          </Info>
        )}

        {requiresTerms && (
          <Info>
            <InfoTerms
              size='12px'
              weight={500}
              color='grey900'
              data-e2e='sbAcceptTerms'
            >
              <CheckBoxInput
                name='sbAcceptTerms'
                checked={acceptTerms}
                data-e2e='sbAcceptTermsCheckbox'
                onChange={() => setAcceptTerms(acceptTerms => !acceptTerms)}
              >
                <FormattedHTMLMessage
                  id='modals.simplebuy.confirm.activity_accept_terms'
                  defaultMessage="I agree to Blockchain’s <a href='https://www.blockchain.com/legal/terms' rel='noopener noreferrer' target='_blank'>Terms of Service</a> and its return, refund and cancellation policy."
                />
              </CheckBoxInput>
            </InfoTerms>
          </Info>
        )}
        {isBankLink && (
          <Info>
            <Text size='12px' weight={500} color='grey900'>
              <FormattedMessage
                id='modals.simplebuy.confirm.ach'
                defaultMessage='For your security, buy orders with a bank account are subject up to a 14 day holding period. You can Swap or Sell during this time. We will notify you once the funds are fully available.'
              />
            </Text>
          </Info>
        )}

        <Button
          fullwidth
          nature='primary'
          data-e2e='confirmSBOrder'
          size='16px'
          height='48px'
          type='submit'
          style={{ marginTop: '28px' }}
          disabled={props.submitting || !acceptTerms}
        >
          {props.submitting ? (
            <HeartbeatLoader height='16px' width='16px' color='white' />
          ) : (
            `${
              orderType === 'BUY' ? 'Buy' : 'Sell'
            } ${baseAmount} ${baseCurrency}`
          )}
        </Button>
        <Button
          data-e2e='sbCancelCheckout'
          disabled={props.submitting}
          size='16px'
          height='48px'
          nature='light-red'
          onClick={handleCancel}
          style={{ marginTop: '16px' }}
        >
          <FormattedMessage id='buttons.cancel' defaultMessage='Cancel' />
        </Button>
        {props.error && (
          <ErrorCartridge
            style={{ marginTop: '16px' }}
            data-e2e='checkoutError'
          >
            <Icon
              name='alert-filled'
              color='red600'
              style={{ marginRight: '4px' }}
            />
            Error: {props.error}
          </ErrorCartridge>
        )}
      </Bottom>
    </CustomForm>
  )
}

type Props = OwnProps &
  SuccessStateType & { supportedCoins: SupportedWalletCurrenciesType }

export default reduxForm<{}, Props>({ form: 'sbCheckoutConfirm' })(Success)
