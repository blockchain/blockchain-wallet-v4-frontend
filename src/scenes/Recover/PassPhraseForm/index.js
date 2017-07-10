import React from 'react'
import { Field, reduxForm } from 'redux-form'
import { required, validMmemonic } from 'services/FormHelper'
import { SecondaryButton } from 'components/generic/Button'
import { Form, TextBox, HelpBlock } from 'components/generic/Form'
import { Text } from 'components/generic/Text'

const LoginForm = (props) => {
  const { handleClickStep1, submitting, invalid } = props

  return (
    <Form>
      <Text id='scenes.recover.passphraseform.passphrase' text='Your recovery phrase' small medium />
      <Field name='guid' validate={[required, validMmemonic]} component={TextBox} />
      <HelpBlock>
        <Text id='scenes.recover.passphraseform.info' text='Enter your 12 recovery words with spaces to recover your funds & transactions' small light altFont />
      </HelpBlock>
      <SecondaryButton id='scenes.recover.passphraseform.continue' text='Continue' disabled={submitting || invalid} onClick={handleClickStep1} fullwidth uppercase />
    </Form>
  )
}

export default reduxForm({ form: 'passPhraseForm' })(LoginForm)
