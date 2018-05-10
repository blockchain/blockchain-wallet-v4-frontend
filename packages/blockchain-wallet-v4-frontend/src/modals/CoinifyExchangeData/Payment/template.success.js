import React from 'react'
import PropTypes from 'prop-types'
import { reduxForm } from 'redux-form'
import { FormattedMessage } from 'react-intl'
import styled from 'styled-components'
import { flex, spacing } from 'services/StyleService'
import Helper from 'components/BuySell/FAQ'
import { StepTransition } from 'components/Utilities/Stepper'
import { path } from 'ramda'

import { Button, HeartbeatLoader, Link } from 'blockchain-info-components'
import { Form, ColLeft, InputWrapper, PartnerHeader, PartnerSubHeader, ColRight, ColRightInner } from 'components/BuySell/Signup'

import { cardOptionHelper, bankOptionHelper } from './mediumHelpers'

const PaymentWrapper = styled.div`
  display: flex;
  flex-direction: row;
`
const CancelWrapper = styled.div`
  a {
    color: #545456;
    font-weight: 300;
    font-size: 14px;
  }
`
const BorderBox = styled.div`
  border: 1px solid ${props => props.theme['gray-1']};
  padding: 30px;
`

const helpers = [
  {
    question: <FormattedMessage id='coinify.payment.helper1.question' defaultMessage='Payment Medium placeholder 1?' />,
    answer: <FormattedMessage id='coinify.payment.helper1.answer' defaultMessage='Answer1 placeholder' />
  },
  {
    question: <FormattedMessage id='coinify.payment.helper2.question' defaultMessage='Payment Medium placeholder 2?' />,
    answer: <FormattedMessage id='coinify.payment.helper2.answer' defaultMessage='Answer2 placeholder' />
  }
]

const faqHelper = () => helpers.map((el, i) => <Helper key={i} question={el.question} answer={el.answer} />)
const busyHelper = (busy) => !busy ? <FormattedMessage id='coinifyexchangedata.payment.continue' defaultMessage='Continue' /> : <HeartbeatLoader height='20px' width='20px' color='white' />

const Payment = (props) => {
  const { value, busy, handlePaymentClick, medium, triggerKyc } = props
  const { limits, quote, level } = value

  const isChecked = (type) => medium === type

  return (
    <Form>
      <ColLeft>
        <BorderBox>
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
        </BorderBox>
      </ColLeft>
      <ColRight>
        <ColRightInner>
          {
            path(['name'], level) < 2 && medium === 'bank'
              ? <Button nature='primary' fullwidth style={spacing('mt-45')} onClick={triggerKyc} disabled={!medium || busy}>
                { busyHelper(busy) }
              </Button>
              : <StepTransition next Component={Button} style={spacing('mt-45')} nature='primary' fullwidth disabled={!medium || busy}>
                { busyHelper(busy) }
              </StepTransition>
          }
          <CancelWrapper style={{ ...flex('row justify/center'), ...spacing('mt-15') }}>
            <StepTransition prev Component={Link}>
              <FormattedMessage id='cancel' defaultMessage='Cancel' />
            </StepTransition>
          </CancelWrapper>
          { faqHelper() }
        </ColRightInner>
      </ColRight>
    </Form>
  )
}

Payment.propTypes = {
  value: PropTypes.object.isRequired,
  busy: PropTypes.oneOfType([
    PropTypes.bool,
    PropTypes.object
  ]),
  handlePaymentClick: PropTypes.func.isRequired,
  medium: PropTypes.string,
  triggerKYC: PropTypes.func
}

export default reduxForm({ form: 'coinifyPayment' })(Payment)
