import React from 'react'
import styled from 'styled-components'
import { FormattedMessage } from 'react-intl'
import { Field, reduxForm } from 'redux-form'

import { required, validEmail, validPassword } from 'services/FormHelper'
import { Button, CheckBox, Form, PasswordBox, Separator, TextBox } from 'blockchain-info-components'
import RouterLink from 'components/RouterLink'
import Terms from 'components/Terms'

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
        <FormattedMessage id='scenes.register.create' defaultMessage='Create your Wallet' />
        <Aligned>
          <FormattedMessage id='scenes.register.or' defaultMessage='or' />
          <RouterLink to='/login'>
            <FormattedMessage id='scenes.register.login' defaultMessage='Login' />
          </RouterLink>
        </Aligned>
      </Header>
      <FormattedMessage id='scenes.register.explain' defaultMessage='Sign up for a free wallet below' />
      <Separator />
      <Form>
        <FormattedMessage id='scenes.register.email' defaultMessage='Email' />
        <Field name='email' validate={[required, validEmail]} component={TextBox} />
        <FormattedMessage id='scenes.register.password' defaultMessage='Password' />
        <Field name='password' validate={[required, validPassword]} component={PasswordBox} score />
        <FormattedMessage id='scenes.register.confirmationPassword' defaultMessage='Confirm Password' />
        <Field name='confirmationPassword' validate={[required, validPassword]} component={PasswordBox} />
        <Field name='terms' validate={[checkboxShouldBeChecked]} component={CheckBox} props={{children: Terms}} />
        <Button type='secondary' fullwidth uppercase disabled={submitting || invalid} onClick={handleClick}>
          <FormattedMessage id='scenes.register.submit' defaultMessage='Continue' />
        </Button>
      </Form>
    </Wrapper>
  )
}

export default reduxForm({ form: 'registerForm' })(Register)
