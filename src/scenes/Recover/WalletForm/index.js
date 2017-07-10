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
  justify-content: flex-end;
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
  const { handleClickStep2, submitting, invalid } = props
  const checkboxShouldBeChecked = value => value ? undefined : 'You must agree with the terms and conditions'

  return (
    <Form>
      <Text id='scenes.recover.walletform.email' text='Email' small medium />
      <Field name='email' validate={[required, validEmail]} component={TextBox} />
      <Text id='scenes.recover.walletform.password' text='Password' small medium />
      <Field name='password' validate={[required, validPassword]} component={PasswordBox} />
      <Text id='scenes.recover.walletform.confirmationPassword' text='Confirm Password' small medium />
      <Field name='confirmationPassword' validate={[required, validPassword]} component={PasswordBox} />
      <Field name='terms' validate={[checkboxShouldBeChecked]} component={CheckBox} props={{children: TermsLabel}} fullwidth />
      <SecondaryButton id='scenes.recover.walletform.recover' text='Recover funds' disabled={submitting || invalid} onClick={handleClickStep2} fullwidth uppercase />
    </Form>
  )
}

export default reduxForm({ form: 'walletForm' })(RegisterForm)
