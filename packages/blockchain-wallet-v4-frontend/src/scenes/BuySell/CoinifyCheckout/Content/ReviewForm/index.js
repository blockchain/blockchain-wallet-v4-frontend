import React from 'react'
import styled from 'styled-components'
import { Field, reduxForm } from 'redux-form'
import { FormattedMessage } from 'react-intl'
import { Button, HeartbeatLoader, Link, Text } from 'blockchain-info-components'
import { Remote } from 'blockchain-wallet-v4/src'

import { CancelWrapper, CenteredWrapper } from 'components/BuySell/Signup'
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

const ReviewForm = (props) => {
  const { invalid, submitting, busy, onSubmit, quoteR } = props

  return (
    <OrderSubmitForm>
      <TermsWrapper>
        <Field name='terms' validate={[required]} component={CheckBox} hideErrors />
        <TermsLabel htmlFor='terms'>
          <Text size='11px' weight={300}>
            <FormattedMessage id='scenes.buysell.coinify.sell.orderreview.checkboxtext' defaultMessage='I accept that Coinify will process my order upon completion of the bitcoin transaction, and that bitcoin will be traded at the available exchange rate at the time, which may differ from the displayed rate.' />
          </Text>
        </TermsLabel>
      </TermsWrapper>
      <CenteredWrapper>
        <Button
          nature='primary'
          fullwidth
          disabled={submitting || invalid || !Remote.Success.is(quoteR) || busy}
          onClick={onSubmit}>
          {
            busy
              ? <HeartbeatLoader height='20px' width='20px' color='white' />
              : <FormattedMessage id='submit' defaultMessage='Submit' />
          }
        </Button>
      </CenteredWrapper>
      <CancelWrapper>
        <StepTransition restart Component={Link}>
          <FormattedMessage id='cancel' defaultMessage='Cancel' />
        </StepTransition>
      </CancelWrapper>
    </OrderSubmitForm>
  )
}

export default reduxForm({ form: 'reviewForm' })(ReviewForm)
