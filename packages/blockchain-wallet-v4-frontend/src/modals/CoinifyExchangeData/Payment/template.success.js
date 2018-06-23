import React from 'react'
import PropTypes from 'prop-types'
import { reduxForm } from 'redux-form'
import { FormattedMessage } from 'react-intl'
import styled from 'styled-components'
import { spacing } from 'services/StyleService'
import Helper from 'components/BuySell/FAQ'
import { StepTransition } from 'components/Utilities/Stepper'
import { equals, path } from 'ramda'

import { Button, HeartbeatLoader, Link } from 'blockchain-info-components'
import { Form, CancelWrapper, ColLeft, ColRight, ColRightInner, InputWrapper, PartnerHeader, PartnerSubHeader } from 'components/BuySell/Signup'

import { cardOptionHelper, bankOptionHelper } from './mediumHelpers'

const PaymentForm = styled(Form)`
  @media (max-width: 480px) {
    flex-direction: column;
  }
`
const PaymentColLeft = styled(ColLeft)`
  @media (max-width: 480px) {
    width: 100%;
  }
`
const PaymentColRight = styled(ColRight)`
  @media (max-width: 480px) {
    width: 100%;
  }
`
const PaymentWrapper = styled.div`
  display: flex;
  flex-direction: row;
  @media (max-width: 480px) {
    flex-direction: column;
    align-items: center;
  }
`
const BorderBox = styled.div`
  border: 1px solid ${props => props.theme['gray-1']};
  padding: 30px;
  @media (max-width: 480px) {
    padding: 20px;
  }
`
const FaqWrapper = styled.div`
  margin-top: 30px;
`
const ButtonContainer = styled.div`
  margin-top: 45px;
  @media (max-width: 480px) {
    margin-top: 20px;
  }
`
const PaymentColRightInner = styled(ColRightInner)`
  @media (max-width: 480px) {
    width: 100%;
    padding-left: 0px;
  }
`

const helpers = [
  {
    question: <FormattedMessage id='coinifyexchangedata.payment.helper1.question' defaultMessage='Are there transaction fees?' />,
    answer: <FormattedMessage id='coinifyexchangedata.payment.helper1.answer' defaultMessage='There is a 3% convenience fee when buying bitcoin with a credit card in order to expedite the transaction. Buying or selling through a bank transfer does not include a convenience fee, although there is a small trading fee (0.25%) that Coinify requires in order to mitigate risk.' />
  }
]

const faqHelper = () => helpers.map((el, i) => <Helper key={i} question={el.question} answer={el.answer} />)
const busyHelper = (busy) => !busy ? <FormattedMessage id='coinifyexchangedata.payment.continue' defaultMessage='Continue' /> : <HeartbeatLoader height='20px' width='20px' color='white' />
const isCardDisabled = (q, l) => {
  if (q.baseCurrency === 'BTC') return Math.abs(q.quoteAmount) > l.card.inRemaining[q.quoteCurrency]
  else return Math.abs(q.baseAmount) > l.card.inRemaining[q.baseCurrency]
}

const Payment = (props) => {
  const { value, busy, handlePaymentClick, medium, triggerKyc, openPendingKyc, quote, handlePrefillCardMax } = props
  const { limits, level, kyc } = value
  const quoteData = path(['data'], quote)
  const kycState = path(['state'], kyc)
  const cardDisabled = isCardDisabled(quoteData, limits)
  const bankDisabled = equals(kycState, 'reviewing') || equals(kycState, 'pending') || equals(kycState, 'processing')
  if (bankDisabled && medium !== 'card') handlePaymentClick('card')
  const prefillCardMax = (limits) => handlePrefillCardMax(limits)

  const isChecked = (type) => medium === type

  return (
    <PaymentForm>
      <PaymentColLeft>
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
            { bankOptionHelper(quoteData, limits, isChecked('bank'), handlePaymentClick, bankDisabled, openPendingKyc, kyc, level) }
            { cardOptionHelper(quoteData, limits, isChecked('card'), handlePaymentClick, cardDisabled, prefillCardMax) }
          </PaymentWrapper>
        </BorderBox>
      </PaymentColLeft>
      <PaymentColRight>
        <PaymentColRightInner>
          <ButtonContainer>
            {
              path(['name'], level) < 2 && medium === 'bank'
                ? <Button nature='primary' fullwidth onClick={triggerKyc} disabled={!medium || busy}>
                  {busyHelper(busy)}
                </Button>
                : <StepTransition next Component={Button} nature='primary' fullwidth disabled={!medium || busy}>
                  {busyHelper(busy)}
                </StepTransition>
            }
          </ButtonContainer>
          <CancelWrapper>
            <StepTransition prev Component={Link}>
              <FormattedMessage id='coinifyexchangedata.payment.cancel' defaultMessage='Cancel' />
            </StepTransition>
          </CancelWrapper>
          <FaqWrapper>
            { faqHelper() }
          </FaqWrapper>
        </PaymentColRightInner>
      </PaymentColRight>
    </PaymentForm>
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
