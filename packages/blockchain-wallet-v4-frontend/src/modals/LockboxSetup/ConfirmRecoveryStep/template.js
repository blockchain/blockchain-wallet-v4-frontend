import React from 'react'
import { FormattedMessage } from 'react-intl'
import { Field, reduxForm } from 'redux-form'

import { required } from 'services/FormHelper'
import { Button, Text } from 'blockchain-info-components'
import { Form, FormItem, TextBox } from 'components/Form'
import Stepper, { StepView, StepTransition } from 'components/Utilities/Stepper'

const ConfirmRecoveryStep = props => {
  const { handleSubmit, invalid } = props

  const validateRequiredPhrase = value => {
    return value === 'COMPLETE' ? (
      undefined
    ) : (
      <FormattedMessage
        id='modals.lockboxsetup.confirmrecovery.step2.incorrectphrase'
        defaultMessage='Incorrect phrase'
      />
    )
  }

  return (
    <Form onSubmit={handleSubmit}>
      <Stepper key='LockboxConfirmRecoveryStep' initialStep={0}>
        <StepView step={0}>
          <Text size='16px' weight={400}>
            <FormattedMessage
              id='modals.lockboxsetup.confirmrecovery.step1.title'
              defaultMessage='Have you saved your 24 word recovery phrase?'
            />
          </Text>
          <Text size='13px' weight={300} style={{ marginTop: '10px' }}>
            <FormattedMessage
              id='modals.lockboxsetup.confirmrecovery.step1.subtitle'
              defaultMessage='This is your only backup for your Carbon. The 12 word backup phrase for your Blockchain wallet DOES NOT cover the funds in your Lockbox.'
            />
          </Text>
          <StepTransition
            next
            Component={Button}
            fullwidth
            nature='primary'
            style={{ marginTop: '25px' }}
          >
            <FormattedMessage
              id='modals.lockboxsetup.confirmrecovery.step1.confirm'
              defaultMessage='Yes, I saved my passphrase'
            />
          </StepTransition>
        </StepView>
        <StepView step={1}>
          <Text size='16px' weight={400}>
            <FormattedMessage
              id='modals.lockboxsetup.confirmrecovery.step2.title'
              defaultMessage='Please confirm that you saved your backup phrase.'
            />
          </Text>
          <Text size='13px' weight={300} style={{ marginTop: '10px' }}>
            <FormattedMessage
              id='modals.lockboxsetup.confirmrecovery.step2.subtitle'
              defaultMessage='This cannot be recovered at a later date. Type COMPLETE to confirm that you have written down your backup phrase.'
            />
          </Text>
          <FormItem style={{ marginTop: '10px' }}>
            <Field
              name='confirm'
              validate={[required, validateRequiredPhrase]}
              component={TextBox}
            />
          </FormItem>
          <StepTransition
            next
            Component={Button}
            fullwidth
            disabled={invalid}
            nature='primary'
            style={{ marginTop: '25px' }}
          >
            <FormattedMessage
              id='modals.lockboxsetup.confirmrecovery.step2.confirm'
              defaultMessage='Continue'
            />
          </StepTransition>
        </StepView>
        <StepView step={2}>
          <Text size='16px' weight={400}>
            <FormattedMessage
              id='modals.lockboxsetup.confirmrecovery.step3.title'
              defaultMessage='Do you want to save you public keys?'
            />
          </Text>
          <Text size='13px' weight={300} style={{ marginTop: '10px' }}>
            <FormattedMessage
              id='modals.lockboxsetup.confirmrecovery.step3.subtitle'
              defaultMessage='Storing your public key will allow you to view your Lockbox balances and receive funds without plugging in your Carbon.'
            />
          </Text>
          <Button
            style={{ marginTop: '25px' }}
            fullwidth
            type='submit'
            nature='primary'
          >
            <FormattedMessage
              id='modals.lockboxsetup.confirmrecovery.step3.yes'
              defaultMessage='Yes, I want to see my balance always'
            />
          </Button>
          <Button
            style={{ marginTop: '5px' }}
            fullwidth
            type='submit'
            nature='sent'
          >
            <FormattedMessage
              id='modals.lockboxsetup.confirmrecovery.step3.no'
              defaultMessage='No thank you'
            />
          </Button>
        </StepView>
      </Stepper>
    </Form>
  )
}

export default reduxForm({ form: 'lockboxConfirmRecovery' })(
  ConfirmRecoveryStep
)
