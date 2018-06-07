import React from 'react'
import { FormattedMessage } from 'react-intl'
import styled from 'styled-components'
import { Field } from 'redux-form'
import { Text, Icon, Link } from 'blockchain-info-components'
import { spacing } from 'services/StyleService'
import { required } from 'services/FormHelper'
import { StepTransition } from 'components/Utilities/Stepper'
import { equals, path } from 'ramda'

const PaymentOptionContainer = styled.div`
  width: 50%;
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
`
const PaymentOption = styled.div`
  display: flex;
  flex-direction: column;
  border: 2px solid #004A7C;
  padding: 15px;
  border-radius: 4px;
  width: 130px;
  cursor: ${props => props.disabled ? 'not-allowed' : 'pointer'};
  background-color: ${props => props.isChecked ? props.theme['brand-primary'] : 'white'};
  opacity: ${props => props.disabled ? 0.3 : 1};
`
const OptionLabel = styled.label`
  display: flex;
  flex-direction: column;
  align-items: center;
  cursor: pointer;
`
const PaymentIcon = styled(Icon)`
  color: ${props => props.isChecked ? 'white' : props.theme['brand-primary']}
`
const PaymentText = styled(Text)`
  color: ${props => props.isChecked ? 'white' : props.theme['brand-primary']}
`
const BankDisabledText = styled(Text)`
  display: flex;
  flex-direction: column;
  align-items: center;
`

export const cardOptionHelper = (quote, limits, isChecked, handlePaymentClick, cardDisabled) => {
  const PaymentRadioCard = ({ isChecked, handlePaymentClick }) => (
    <PaymentOption isChecked={isChecked} onClick={() => !cardDisabled && handlePaymentClick('card')} disabled={cardDisabled} >
      <input type='radio' name='inMedium' id='card' value='card' style={{display: 'none'}} />
      <OptionLabel htmlFor='card'>
        <PaymentIcon name='credit-card-filled' cursor size='50px' isChecked={isChecked} />
        <PaymentText isChecked={isChecked}>
          <FormattedMessage id='coinifyexchangedata.payment.mediumhelpers.card' defaultMessage='Credit / Debit' />
        </PaymentText>
      </OptionLabel>
    </PaymentOption>
  )

  const renderField = () => <Field name='inMedium' value='card' isChecked={isChecked} handlePaymentClick={handlePaymentClick} component={PaymentRadioCard} validate={[required]} />

  const renderContainer = (isChecked, handlePaymentClick) => (
    <PaymentOptionContainer>
      { renderField() }
      <Text size='14px' weight={300} style={spacing('mt-25')}>
        <FormattedMessage id='coinifyexchangedata.payment.mediumhelpers.card.detail1' defaultMessage='Receive bitcoin instantly' /><br />
        <FormattedMessage id='coinifyexchangedata.payment.mediumhelpers.card.detail2' defaultMessage='3% convenience fee' /><br />
        <FormattedMessage id='coinifyexchangedata.payment.mediumhelpers.card.detail3' defaultMessage='Visa or Mastercard' />
      </Text>
    </PaymentOptionContainer>
  )

  const renderText = (currency, amount, limit) => (
    <PaymentOptionContainer>
      { renderField() }
      <Text size='14px' weight={300} style={spacing('mt-25 mb-15')}>
        <FormattedMessage id='coinifyexchangedata.payment.mediumhelpers.card.abovecardlimit' defaultMessage='{amount} {currency} is above your daily credit card limit of {limit} {currency}. Please use a bank transfer or lower your purchase amount.' values={{ currency: currency, amount: amount, limit: limit }} />
      </Text>
      <StepTransition prev Component={Link} size='13px' weight={300}>
        <FormattedMessage id='coinifyexchangedata.payment.mediumhelpers.card.usecreditdebit' defaultMessage='Use Credit/Debit card' />
      </StepTransition>
    </PaymentOptionContainer>
  )

  const { baseCurrency, quoteAmount, quoteCurrency, baseAmount } = quote

  if (quote.baseCurrency === 'BTC') {
    if (Math.abs(quoteAmount) <= limits.card.inRemaining[quoteCurrency]) {
      return renderContainer(isChecked, handlePaymentClick)
    } else {
      return renderText(quoteCurrency, Math.abs(quoteAmount), limits.card.inRemaining[quoteCurrency])
    }
  } else {
    if (Math.abs(baseAmount) <= limits.card.inRemaining[baseCurrency]) {
      return renderContainer(isChecked, handlePaymentClick)
    } else {
      return renderText(baseCurrency, Math.abs(baseAmount), limits.card.inRemaining[baseCurrency])
    }
  }
}

export const bankOptionHelper = (quote, limits, isChecked, handlePaymentClick, bankDisabled, openPendingKyc, kyc) => {
  const PaymentRadioBank = ({ isChecked, handlePaymentClick }) => (
    <PaymentOption isChecked={isChecked} onClick={() => handlePaymentClick('bank')} disabled={bankDisabled}>
      <input type='radio' name='inMedium' id='bank' value='bank' style={{display: 'none'}} />
      <OptionLabel htmlFor='bank'>
        <PaymentIcon name='bank-filled' cursor size='50px' isChecked={isChecked} />
        <PaymentText isChecked={isChecked}>
          <FormattedMessage id='coinifyexchangedata.payment.mediumhelpers.bank' defaultMessage='Bank Transfer' />
        </PaymentText>
      </OptionLabel>
    </PaymentOption>
  )

  const renderContainer = (isChecked, handlePaymentClick) => (
    <PaymentOptionContainer>
      <Field name='inMedium' value='bank' isChecked={isChecked} handlePaymentClick={handlePaymentClick} component={PaymentRadioBank} validate={[required]} />
      {
        bankDisabled
          ? <BankDisabledText size='14px' weight={300} color='gray-2' style={spacing('mt-25')}>
            <FormattedMessage id='scenes.buysell.coinifyexchangedata.payment.bank.unavailable' defaultMessage='Bank transfers are unavailable until Identity Verification has been finished.' />
            {
              equals(path(['state'], kyc), 'pending')
                ? <Link size='12px' weight={300} style={spacing('mt-10')} onClick={() => openPendingKyc(kyc)}>
                  <FormattedMessage id='scenes.buysell.coinifyexchangedata.payment.bank.finishkyc' defaultMessage='Finish Identity Verification' /><br />
                </Link>
                : null
            }
          </BankDisabledText>
          : <Text size='14px' weight={300} style={spacing('mt-25')}>
            <FormattedMessage id='coinifyexchangedata.payment.mediumhelpers.bank.detail1' defaultMessage='One time ID verification' /><br />
            <FormattedMessage id='coinifyexchangedata.payment.mediumhelpers.bank.detail2' defaultMessage='Receive bitcoin in 2-3 days' /><br />
            <FormattedMessage id='coinifyexchangedata.payment.mediumhelpers.bank.detail3' defaultMessage='0.25% Payment Fee' />
          </Text>
      }
    </PaymentOptionContainer>
  )

  const renderText = () => (
    <PaymentOptionContainer>
      <Text>
        Can't use bank medium
      </Text>
    </PaymentOptionContainer>
  )

  if (quote.baseCurrency === 'BTC') {
    if (Math.abs(quote.quoteAmount) >= limits.bank.minimumInAmounts[quote.quoteCurrency]) {
      return renderContainer(isChecked, handlePaymentClick)
    } else {
      renderText()
    }
  } else {
    if (Math.abs(quote.baseAmount) >= limits.bank.minimumInAmounts[quote.baseCurrency]) {
      return renderContainer(isChecked, handlePaymentClick)
    } else {
      renderText()
    }
  }
}
