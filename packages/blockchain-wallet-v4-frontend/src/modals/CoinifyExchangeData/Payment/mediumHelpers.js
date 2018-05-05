import React from 'react'
import { FormattedMessage } from 'react-intl'
import styled from 'styled-components'
import { Field } from 'redux-form'
import { Text, Icon } from 'blockchain-info-components'
import { spacing } from 'services/StyleService'
import { required } from 'services/FormHelper'

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
  cursor: pointer;
  background-color: ${props => props.isChecked ? props.theme['brand-primary'] : 'white'};
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

export const cardOptionHelper = (quote, limits, isChecked, handlePaymentClick) => {
  const PaymentRadioCard = ({ isChecked, handlePaymentClick }) => (
    <PaymentOption isChecked={isChecked} onClick={() => handlePaymentClick('card')} >
      <input type='radio' name='inMedium' id='card' value='card' style={{display: 'none'}} />
      <OptionLabel htmlFor='card'>
        <PaymentIcon name='credit-card-filled' cursor size='50px' isChecked={isChecked} />
        <PaymentText isChecked={isChecked}>
          <FormattedMessage id='coinifyexchangedata.payment.card' defaultMessage='Credit / Debit' />
        </PaymentText>
      </OptionLabel>
    </PaymentOption>
  )

  const renderContainer = (isChecked, handlePaymentClick) => (
    <PaymentOptionContainer>
      <Field name='inMedium' value='card' isChecked={isChecked} handlePaymentClick={handlePaymentClick} component={PaymentRadioCard} validate={[required]} />
      <Text size='14px' weight={300} color='gray-2' style={spacing('mt-25')}>
        <FormattedMessage id='coinifyexchangedata.payment.card.detail1' defaultMessage='Receive bitcoin instantly' /><br />
        <FormattedMessage id='coinifyexchangedata.payment.card.detail2' defaultMessage='3% convenience fee' /><br />
        <FormattedMessage id='coinifyexchangedata.payment.card.detail3' defaultMessage='Visa or Mastercard' />
      </Text>
    </PaymentOptionContainer>
  )

  const renderText = () => (
    <PaymentOptionContainer>
      <Text>
        Can't use card medium
      </Text>
    </PaymentOptionContainer>
  )

  if (quote.baseCurrency === 'BTC') {
    if (Math.abs(quote.quoteAmount) <= limits.card.inRemaining[quote.quoteCurrency]) {
      return renderContainer(isChecked, handlePaymentClick)
    } else {
      renderText()
    }
  } else {
    if (Math.abs(quote.baseAmount) <= limits.card.inRemaining[quote.baseCurrency]) {
      return renderContainer(isChecked, handlePaymentClick)
    } else {
      renderText()
    }
  }

  // if (Math.abs(quote.baseAmount) <= limits.card.inRemaining[quote.baseCurrency]) {
  //   return renderContainer(isChecked, handlePaymentClick)
  // } else {
  //   renderText()
  // }
}

export const bankOptionHelper = (quote, limits, isChecked, handlePaymentClick) => {
  const PaymentRadioBank = ({ isChecked, handlePaymentClick }) => (
    <PaymentOption isChecked={isChecked} onClick={() => handlePaymentClick('bank')} >
      <input type='radio' name='inMedium' id='bank' value='bank' style={{display: 'none'}} />
      <OptionLabel htmlFor='bank'>
        <PaymentIcon name='bank-filled' cursor size='50px' isChecked={isChecked} />
        <PaymentText isChecked={isChecked}>
          <FormattedMessage id='coinifyexchangedata.payment.bank' defaultMessage='Bank Transfer' />
        </PaymentText>
      </OptionLabel>
    </PaymentOption>
  )

  const renderContainer = (isChecked, handlePaymentClick) => (
    <PaymentOptionContainer>
      <Field name='inMedium' value='bank' isChecked={isChecked} handlePaymentClick={handlePaymentClick} component={PaymentRadioBank} validate={[required]} />
      <Text size='14px' weight={300} color='gray-2' style={spacing('mt-25')}>
        <FormattedMessage id='coinifyexchangedata.payment.bank.detail1' defaultMessage='One time ID verification' /><br />
        <FormattedMessage id='coinifyexchangedata.payment.bank.detail2' defaultMessage='Receive bitcoin in 2-3 days' /><br />
        <FormattedMessage id='coinifyexchangedata.payment.bank.detail3' defaultMessage='No payment fees' />
      </Text>
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
