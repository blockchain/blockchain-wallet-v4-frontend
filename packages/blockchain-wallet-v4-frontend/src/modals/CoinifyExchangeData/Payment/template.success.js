import React from 'react'
import PropTypes from 'prop-types'
import { reduxForm, Field } from 'redux-form'
import { FormattedMessage } from 'react-intl'
import styled from 'styled-components'
import { spacing } from 'services/StyleService'

import { Button, HeartbeatLoader, Text, Icon } from 'blockchain-info-components'
import { Form, ColLeft, InputWrapper, PartnerHeader, PartnerSubHeader, ColRight } from 'components/BuySell/Signup'

import { required } from 'services/FormHelper'

const PaymentWrapper = styled.div`
  display: flex;
  flex-direction: row;
`
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

const Payment = (props) => {
  const { ui, value, busy, onSubmit, checked, handlePaymentClick, medium } = props
  const { profile, limits, level, mediums } = value

  const isChecked = (type) => medium === type

  const PaymentRadioCard = ({ isChecked }) => (
    <PaymentOption isChecked={isChecked} onClick={() => handlePaymentClick('card')} >
      <input type='radio' name='inMedium' id='card' value='card' style={{display: 'none'}} />
      <OptionLabel htmlFor='card'>
        <PaymentIcon name='credit-card-filled' cursor='pointer' size='50px' isChecked={isChecked} />
        <PaymentText isChecked={isChecked}>
          <FormattedMessage id='coinifyexchangedata.payment.card' defaultMessage='Credit / Debit' />
        </PaymentText>
      </OptionLabel>
    </PaymentOption>
  )

  const PaymentRadioBank = ({ isChecked }) => (
    <PaymentOption isChecked={isChecked} onClick={() => handlePaymentClick('bank')} >
      <input type='radio' name='inMedium' id='bank' value='bank' style={{display: 'none'}} />
      <OptionLabel htmlFor='bank'>
        <PaymentIcon name='bank-filled' cursor='pointer' size='50px' isChecked={isChecked} />
        <PaymentText isChecked={isChecked}>
          <FormattedMessage id='coinifyexchangedata.payment.bank' defaultMessage='Bank Transfer' />
        </PaymentText>
      </OptionLabel>
    </PaymentOption>
  )

  console.log('payment template', props)
  return (
    <Form onSubmit={onSubmit}>
      <ColLeft>
        <InputWrapper style={spacing('mb-40')}>
          <PartnerHeader>
            <FormattedMessage id='coinifyexchangedata.payment.header' defaultMessage='Select Payment Method' />
          </PartnerHeader>
          <PartnerSubHeader>
            <FormattedMessage id='coinifyexchangedata.payment.subheader' defaultMessage='You can link your bank account or credit card to buy cryptocurrency. Select the account that you would like to use to fund your purchases. You can always change your payment method.' />
          </PartnerSubHeader>
        </InputWrapper>
        <PaymentWrapper>
          <PaymentOptionContainer>
            <Field name='inMedium' value='bank' isChecked={isChecked('bank')} component={PaymentRadioBank} validate={[required]} />
            <Text size='14px' weight={300} color='gray-2' style={spacing('mt-25')}>
              <FormattedMessage id='coinifyexchangedata.payment.bank.detail1' defaultMessage='One time ID verification' /><br />
              <FormattedMessage id='coinifyexchangedata.payment.bank.detail2' defaultMessage='Receive bitcoin in 2-3 days' /><br />
              <FormattedMessage id='coinifyexchangedata.payment.bank.detail3' defaultMessage='No payment fees' />
            </Text>
          </PaymentOptionContainer>
          <PaymentOptionContainer>
            <Field name='inMedium' value='card' isChecked={isChecked('card')} component={PaymentRadioCard} validate={[required]} />
            <Text size='14px' weight={300} color='gray-2' style={spacing('mt-25')}>
              <FormattedMessage id='coinifyexchangedata.payment.card.detail1' defaultMessage='Receive bitcoin instantly' /><br />
              <FormattedMessage id='coinifyexchangedata.payment.card.detail2' defaultMessage='3% convenience fee' /><br />
              <FormattedMessage id='coinifyexchangedata.payment.card.detail3' defaultMessage='Visa or Mastercard' />
            </Text>
          </PaymentOptionContainer>
        </PaymentWrapper>
      </ColLeft>
      <ColRight>
        <Button uppercase nature='primary' fullwidth type='submit' disabled={!medium || busy}>
          {
            !busy
              ? <FormattedMessage id='coinifyexchangedata.confirm.confirm' defaultMessage='confirm' />
              : <HeartbeatLoader height='20px' width='20px' color='white' />
          }
        </Button>
        {/* <Helper1 />
        <Helper2 /> */}
      </ColRight>
    </Form>
  )
}

Payment.propTypes = {
  handleSignup: PropTypes.func.isRequired,
  smsNumber: PropTypes.string
}

export default reduxForm({ form: 'coinifyPayment' })(Payment)
