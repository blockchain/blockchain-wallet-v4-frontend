import React from 'react'
import styled from 'styled-components'
import { Field, reduxForm } from 'redux-form'

import { required, validEmail, validPassword } from 'services/FormHelper'
import { SecondaryButton } from 'components/generic/Button'
import { Form, PasswordBox, TextBox, CheckBox } from 'components/generic/Form'
import { Link, RouterLink } from 'components/generic/Link'
import { Text } from 'components/generic/Text'
import { Separator } from 'components/generic/Separator'
import Terms from 'components/shared/Terms'

const Wrapper = styled.div`
  width: 100%;
  padding: 40px;
  box-sigin: border-box;
  background-color: #FFFFFF;

  @media(min-width: 768px) { width: 550px; }
`
const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`
const Aligned = styled.div`
  & > * { display: inline-block; margin-right: 5px; }
`

const Register = (props) => {
  const { handleClick, submitting, invalid } = props
  const checkboxShouldBeChecked = value => value ? undefined : 'You must agree with the terms and conditions'

  return (
    <Wrapper>
      <Header>
        <Text id='scenes.register.create' text='Create your Wallet' biggest light />
        <Aligned>
          <Text id='scenes.register.or' text='or' small light />
          <RouterLink to='/login'><Text id='scenes.register.login' text='Login' small light cyan /></RouterLink>
        </Aligned>
      </Header>
      <Text id='scenes.register.explain' text='Sign up for a free wallet below' small light altFont />
      <Separator />
      <Form>
        <Text id='scenes.register.email' text='Email' small medium />
        <Field name='email' validate={[required, validEmail]} component={TextBox} />
        <Text id='scenes.register.password' text='Password' small medium />
        <Field name='password' validate={[required, validPassword]} component={PasswordBox} score />
        <Text id='scenes.register.confirmationPassword' text='Confirm Password' small medium />
        <Field name='confirmationPassword' validate={[required, validPassword]} component={PasswordBox} />
        <Field name='terms' validate={[checkboxShouldBeChecked]} component={CheckBox} props={{children: Terms}} fullwidth />
        <SecondaryButton disabled={submitting || invalid} onClick={handleClick} fullwidth>
          <Text id='scenes.register.submit' text='Continue'uppercase white />
        </SecondaryButton>
      </Form>
    </Wrapper>
  )
}

export default reduxForm({ form: 'registerForm' })(Register)
