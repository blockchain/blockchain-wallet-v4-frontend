import React from 'react'
import PropTypes from 'prop-types'
import { reduxForm, Field } from 'redux-form'
import { FormattedMessage } from 'react-intl'
import styled from 'styled-components'
import { spacing } from 'services/StyleService'

import { Button, HeartbeatLoader, Text, Icon } from 'blockchain-info-components'
import { Form, ColLeft, InputWrapper, PartnerHeader, PartnerSubHeader, ColRight } from 'components/BuySell/Signup'

import { required } from 'services/FormHelper'

import { cardOptionHelper, bankOptionHelper } from './mediumHelpers'

const PaymentWrapper = styled.div`
  display: flex;
  flex-direction: row;
`

const Payment = (props) => {
  const { ui, value, busy, onSubmit, checked, handlePaymentClick, medium, quote } = props
  const { profile, limits, level, mediums } = value

  const isChecked = (type) => medium === type

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
          { bankOptionHelper(quote, limits, isChecked('bank'), handlePaymentClick) }
          { cardOptionHelper(quote, limits, isChecked('card'), handlePaymentClick) }
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
