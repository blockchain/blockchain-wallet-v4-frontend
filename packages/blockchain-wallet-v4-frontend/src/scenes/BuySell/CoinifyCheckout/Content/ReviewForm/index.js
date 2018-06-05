import React from 'react'
import { Field, reduxForm } from 'redux-form'
import { FormattedMessage } from 'react-intl'
import { equals } from 'ramda'
import { Button, HeartbeatLoader, Link, Text } from 'blockchain-info-components'
import { Remote } from 'blockchain-wallet-v4/src'

import { CancelWrapper, CenteredWrapper, Row } from 'components/BuySell/Signup'
import { CheckBox } from 'components/Form'
import { StepTransition } from 'components/Utilities/Stepper'
import { required } from 'services/FormHelper'

const ReviewForm = (props) => {
  const { invalid, submitting, busy, onSubmit, quoteR, type } = props
  const isSell = equals(type, 'sell')
  return (
    <form>
      {
        isSell &&
        <Row>
          <Field name='coinifycheckbox' component={CheckBox} validate={[required]} />
          <Text size='12px' width={300}>
            <FormattedMessage id='scenes.buysell.coinify.sell.orderreview.checkboxtext' defaultMessage='I accept that Coinify will process my order upon completion of the bitcoin transaction, and that bitcoin will be traded at the available exchange rate at the time, which may differ from the displayed rate.' />
          </Text>
        </Row>
      }
      <CenteredWrapper>
        <Button
          nature='primary'
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
    </form>
  )
}

export default reduxForm({ form: 'reviewForm' })(ReviewForm)
