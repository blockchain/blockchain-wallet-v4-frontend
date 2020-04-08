import { Field } from 'redux-form'
import { FormattedMessage } from 'react-intl'
import { Icon, Text } from 'blockchain-info-components'
import { prop } from 'ramda'
import { required } from 'services/FormHelper'
import media from 'services/ResponsiveService'
import React from 'react'
import styled from 'styled-components'

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
  border: 1px solid ${props => props.theme.grey000};
  padding: 15px;
  border-radius: 4px;
  width: 130px;
  cursor: ${props => (props.disabled ? 'not-allowed' : 'pointer')};
  background-color: ${props => props.theme.white};
  opacity: ${props => (props.disabled ? 0.3 : 1)};
  margin-right: ${props => props.marginRight};
  :hover {
    background-color: ${props => !props.disabled && props.theme.blue600};
    label {
      > span {
        color: ${props => !props.disabled && props.theme.white};
      }
      > div {
        color: ${props => !props.disabled && props.theme.white};
      }
    }
  }
`
const OptionLabel = styled.label`
  display: flex;
  flex-direction: column;
  align-items: center;
  cursor: ${props => (props.disabled ? 'not-allowed' : 'pointer')};
`
const PaymentIcon = styled(Icon)`
  color: ${props => props.theme.blue900};
  cursor: ${props => props.disabled && 'not-allowed'};
`
const PaymentText = styled(Text)`
  color: ${props => props.theme.blue900};
`

const PaymentRadioCard = ({ handlePaymentClick, disabled }) => (
  <PaymentOption onClick={() => handlePaymentClick('card')} disabled={disabled}>
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
  const isDisabled = prop('medium', disabled) === 'card'
  return (
    <PaymentOptionContainer onClick={() => handlePaymentClick('card')}>
      <Field
        name='inMedium'
        value='card'
        handlePaymentClick={handlePaymentClick}
        component={PaymentRadioCard}
        validate={[required]}
        disabled={isDisabled}
      />
      <Text size='12px' weight={400}>
        {isDisabled ? (
          <Text size='12px' weight={400}>
            {prop('type', disabled) === 'under_card' ? (
              <FormattedMessage
                id='coinifyexchangedata.payment.mediumhelpers.card.disabled_min'
                defaultMessage='The order amount is less than the credit card minimum of {cardMin}.'
                values={{ cardMin: prop('limit', disabled) }}
              />
            ) : prop('type', disabled) === 'over_card' ? (
              <FormattedMessage
                id='coinifyexchangedata.payment.mediumhelpers.card.disabled_max'
                defaultMessage='Orders over {cardLimit} can only be processed through bank transfer.'
                values={{ cardLimit: prop('limit', disabled) }}
              />
            ) : (
              <FormattedMessage
                id='coinifyexchangedata.payment.mediumhelpers.card.disabled_other'
                defaultMessage='Credit card payment is not available for this order.'
              />
            )}
          </Text>
        ) : (
          <Text size='12px' weight={400}>
            <FormattedMessage
              id='coinifyexchangedata.payment.mediumhelpers.card.detail1'
              defaultMessage='Receive bitcoin instantly'
            />
            <br />
            <FormattedMessage
              id='coinifyexchangedata.payment.mediumhelpers.card.detail2'
              defaultMessage='3% convenience fee'
            />
          </Text>
        )}
      </Text>
    </PaymentOptionContainer>
  )
}

const PaymentRadioBank = ({ disabled }) => (
  <PaymentOption disabled={disabled}>
    <input
      type='radio'
      name='inMedium'
      id='bank'
      value='bank'
      style={{ display: 'none' }}
    />
    <OptionLabel htmlFor='bank' disabled={disabled}>
      <PaymentIcon name='bank-filled' cursor size='50px' disabled={disabled} />
      <PaymentText>
        <FormattedMessage
          id='coinifyexchangedata.payment.mediumhelpers.bank'
          defaultMessage='Bank Transfer'
        />
      </PaymentText>
    </OptionLabel>
  </PaymentOption>
)

export function BankOption ({ handlePaymentClick, disabled }) {
  const isDisabled = prop('medium', disabled) === 'bank'
  return (
    <PaymentOptionContainer onClick={() => handlePaymentClick('bank')}>
      <Field
        name='inMedium'
        value='bank'
        component={PaymentRadioBank}
        validate={[required]}
        disabled={isDisabled}
      />
      {isDisabled ? (
        <Text size='12px' weight={400}>
          {prop('type', disabled) === 'under_bank' ? (
            <FormattedMessage
              id='coinifyexchangedata.payment.mediumhelpers.bank.disabled_min'
              defaultMessage='The order amount is less than the bank minimum of {bankMin}.'
              values={{ bankMin: prop('limit', disabled) }}
            />
          ) : prop('type', disabled) === 'over_bank' ? (
            <FormattedMessage
              id='coinifyexchangedata.payment.mediumhelpers.bank.disabled_max'
              defaultMessage='The order amount is over your bank limit of {bankLimit}.'
              values={{ bankLimit: prop('limit', disabled) }}
            />
          ) : (
            <FormattedMessage
              id='coinifyexchangedata.payment.mediumhelpers.bank.disabled_other'
              defaultMessage='Bank transfers are not available for this order.'
            />
          )}
        </Text>
      ) : (
        <Text size='12px' weight={400}>
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
      )}
    </PaymentOptionContainer>
  )
}
