import React from 'react'
import styled from 'styled-components'
import { Field, reduxForm } from 'redux-form'

import { required, validEmail, validPassword } from 'services/FormHelper'
import { SecondaryButton } from 'components/generic/Button'
import { Form, PasswordBox, TextBox, CheckBox } from 'components/generic/Form'
import { Link } from 'components/generic/Link'
import { Text } from 'components/generic/Text'

const TermsLabelContainer = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
  align-items: center;
`

const TermsLabel = (
  <TermsLabelContainer>
    <Text id='scenes.register.registerform.read' text='I have read and agree to the' small light />
    <Link href='https://blockchain.info/Resources/TermsofServicePolicy.pdf' target='_blank'>
      <Text id='scenes.register.registerform.terms' text='Terms of Service' small light cyan />
    </Link>
  </TermsLabelContainer>
)

const RegisterForm = (props) => {
  const { handleClick, submitting, invalid } = props
  const checkboxShouldBeChecked = value => value ? undefined : 'You must agree with the terms and conditions'

  return (
    <Form>
      <Text id='scenes.register.registerform.email' text='Email' small medium />
      <Field name='email' validate={[required, validEmail]} component={TextBox} />
      <Text id='scenes.register.registerform.password' text='Password' small medium />
      <Field name='password' validate={[required, validPassword]} component={PasswordBox} />
      <Text id='scenes.register.registerform.confirmationPassword' text='Confirm Password' small medium />
      <Field name='confirmationPassword' validate={[required, validPassword]} component={PasswordBox} />
      <Field name='terms' validate={[checkboxShouldBeChecked]} component={CheckBox} props={{children: TermsLabel}} fullwidth />
      <SecondaryButton id='scenes.register.registerform.submit' text='Continue' disabled={submitting || invalid} onClick={handleClick} fullwidth uppercase />
    </Form>
  )
}

export default reduxForm({ form: 'registerForm' })(RegisterForm)
