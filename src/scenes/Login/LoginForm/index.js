import React from 'react'
import { Field, reduxForm } from 'redux-form'

import { required } from 'services/FormHelper'
import { SecondaryButton } from 'components/generic/Button'
import { Form, PasswordBox, TextBox, HelpBlock } from 'components/generic/Form'
import { Text } from 'components/generic/Text'

const LoginForm = (props) => {
  const { onSubmit, submitting } = props

  return (
    <Form>
      <Text id='scenes.login.guid' text='Wallet ID' small medium />
      <Field name='guid' validate={[required]} component={TextBox} />
      <HelpBlock>
        <Text id='scenes.login.info' text='Find the login link in your email, ' small altFont />
        <Text id='scenes.login.info2' text='e.g. blockchain.info/wallet/1111-222-333...' small altFont italic />
        <Text id='scenes.login.info3' text='The series of numbers and dashes at the end of the link is your Wallet ID.' small altFont />
      </HelpBlock>
      <Text id='scenes.login.password' text='Password' small medium />
      <Field name='password' validate={[required]} component={PasswordBox} />
      <SecondaryButton id='scenes.login.loginform.submit' text='Login' disabled={submitting} onClick={onSubmit} fullwidth uppercase />
    </Form>
  )
}

export default reduxForm({ form: 'loginForm' })(LoginForm)
