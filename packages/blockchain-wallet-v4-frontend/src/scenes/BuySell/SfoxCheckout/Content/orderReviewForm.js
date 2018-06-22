import React from 'react'
import styled from 'styled-components'
import { Field, reduxForm } from 'redux-form'
import { FormattedMessage } from 'react-intl'
import { Button, HeartbeatLoader, Link, Text } from 'blockchain-info-components'
import { Remote } from 'blockchain-wallet-v4/src'
import { prop } from 'ramda'
import { CancelWrapper } from 'components/BuySell/Signup'
import { CheckBox } from 'components/Form'
import { StepTransition } from 'components/Utilities/Stepper'
import { required } from 'services/FormHelper'

const OrderSubmitForm = styled.form`
  margin-bottom: 30px;
`
const TermsWrapper = styled.div`
  display: flex;
  margin-bottom: 30px;
`
const TermsLabel = styled.label`
  padding-top: 3px;
`
const ToSLink = styled.a`
  text-decoration: none;
  color: ${props => props.theme['brand-secondary']};
`

const ReviewForm = (props) => {
  const { invalid, busy, onSubmit, quoteR, account } = props

  return (
    <OrderSubmitForm>
      <TermsWrapper>
        <Field name='terms' validate={[required]} component={CheckBox} hideErrors />
        <TermsLabel htmlFor='terms'>
          <Text size='11px' weight={300}>
            <FormattedMessage id='scenes.buysell.sfox.orderreview.checkboxtext' defaultMessage='I authorize SFOX, Inc. to debit my linked bank account ending in {account} and comply with the SFOX {ToS}.' values={{ account: prop('accountNumber', account), ToS: <ToSLink rel='noopener noreferrer' target='_blank' href='https://www.sfox.com/terms.html'>Terms of Service</ToSLink> }} />
          </Text>
        </TermsLabel>
      </TermsWrapper>
      <Button
        fullwidth
        nature='primary'
        disabled={invalid || busy || !Remote.Success.is(quoteR)}
        onClick={quoteR.map((quote) => () => onSubmit(quote)).getOrElse(null)}>
        {
          busy
            ? <HeartbeatLoader height='20px' width='20px' color='white' />
            : <FormattedMessage id='buysell.sfoxcheckout.orderreview.submit' defaultMessage='Submit' />
        }
      </Button>
      <CancelWrapper>
        <StepTransition prev Component={Link}>
          <FormattedMessage id='buysell.sfoxcheckout.orderreview.cancel' defaultMessage='Cancel' />
        </StepTransition>
      </CancelWrapper>
    </OrderSubmitForm>
  )
}

export default reduxForm({ form: 'reviewForm' })(ReviewForm)
