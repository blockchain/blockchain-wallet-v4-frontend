import React, { Fragment } from 'react'
import { FormattedMessage } from 'react-intl'
import styled from 'styled-components'
import { Field } from 'redux-form'
import { prop } from 'ramda'
import { Text, Icon } from 'blockchain-info-components'
import { required } from 'services/FormHelper'
import media from 'services/ResponsiveService'

const PaymentOptionContainer = styled.div`
  width: 160px;
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  div:nth-child(2) {
    margin-top: 25px;
  }
  ${media.mobile`
    width: 200px;
    div:nth-child(2) {
      margin-top: 10px;
      margin-bottom: 20px;
    }
  `};
`
const PaymentOption = styled.div`
  display: flex;
  flex-direction: column;
  border: 1px solid ${props => props.theme['gray-1']};
  padding: 15px;
  border-radius: 4px;
  width: 130px;
  cursor: ${props => (props.disabled ? 'not-allowed' : 'pointer')};
  background-color: ${props =>
    props.isChecked ? props.theme['brand-secondary'] : 'white'};
  opacity: ${props => (props.disabled ? 0.3 : 1)};
  margin-right: ${props => props.marginRight};
`
const OptionLabel = styled.label`
  display: flex;
  flex-direction: column;
  align-items: center;
  cursor: ${props => (props.disabled ? 'not-allowed' : 'pointer')};
`
const PaymentIcon = styled(Icon)`
  color: ${props => (props.isChecked ? 'white' : props.theme['brand-primary'])};
  cursor: ${props => props.disabled && 'not-allowed'};
`
const PaymentText = styled(Text)`
  color: ${props => (props.isChecked ? 'white' : props.theme['brand-primary'])};
`

const PaymentRadioCard = ({ handlePaymentClick, disabled }) => (
  <PaymentOption
    onClick={() => handlePaymentClick('card', disabled)}
    disabled={disabled}
  >
    <input
      type='radio'
      name='inMedium'
      id='card'
      value='card'
      style={{ display: 'none' }}
    />
    <OptionLabel htmlFor='card' disabled={disabled}>
      <PaymentIcon
        name='credit-card-filled'
        cursor
        size='50px'
        disabled={disabled}
      />
      <PaymentText>
        <FormattedMessage
          id='coinifyexchangedata.payment.mediumhelpers.card'
          defaultMessage='Credit / Debit'
        />
      </PaymentText>
    </OptionLabel>
  </PaymentOption>
)

export function CardOption ({ handlePaymentClick, disabled }) {
  return (
    <PaymentOptionContainer>
      <Field
        name='inMedium'
        value='card'
        handlePaymentClick={handlePaymentClick}
        component={PaymentRadioCard}
        validate={[required]}
        disabled={prop('medium', disabled) === 'card'}
      />
      <Text size='12px' weight={300}>
        {prop('medium', disabled) === 'card' ? (
          <Fragment>
            <FormattedMessage
              id='coinifyexchangedata.payment.mediumhelpers.card.disabled'
              defaultMessage='Orders over {cardLimit} can only be processed through bank transfer.'
              values={{ cardLimit: prop('limit', disabled) }}
            />
          </Fragment>
        ) : (
          <Fragment>
            <FormattedMessage
              id='coinifyexchangedata.payment.mediumhelpers.card.detail1'
              defaultMessage='Receive bitcoin instantly'
            />
            <br />
            <FormattedMessage
              id='coinifyexchangedata.payment.mediumhelpers.card.detail2'
              defaultMessage='3% convenience fee'
            />
            <br />
            <FormattedMessage
              id='coinifyexchangedata.payment.mediumhelpers.card.detail3'
              defaultMessage='Visa or Mastercard'
            />
          </Fragment>
        )}
      </Text>
    </PaymentOptionContainer>
  )
}

const PaymentRadioBank = ({ handlePaymentClick }) => (
  <PaymentOption onClick={() => handlePaymentClick('bank')}>
    <input
      type='radio'
      name='inMedium'
      id='bank'
      value='bank'
      style={{ display: 'none' }}
    />
    <OptionLabel htmlFor='bank'>
      <PaymentIcon name='bank-filled' cursor size='50px' />
      <PaymentText>
        <FormattedMessage
          id='coinifyexchangedata.payment.mediumhelpers.bank'
          defaultMessage='Bank Transfer'
        />
      </PaymentText>
    </OptionLabel>
  </PaymentOption>
)

export function BankOption ({ handlePaymentClick }) {
  return (
    <PaymentOptionContainer>
      <Field
        name='inMedium'
        value='bank'
        handlePaymentClick={handlePaymentClick}
        component={PaymentRadioBank}
        validate={[required]}
      />
      <Text size='12px' weight={300}>
        <FormattedMessage
          id='coinifyexchangedata.payment.mediumhelpers.bank.detail2'
          defaultMessage='Receive bitcoin in 2-3 days'
        />
        <br />
        <FormattedMessage
          id='coinifyexchangedata.payment.mediumhelpers.bank.detail3'
          defaultMessage='0.25% Payment Fee'
        />
      </Text>
    </PaymentOptionContainer>
  )
}
