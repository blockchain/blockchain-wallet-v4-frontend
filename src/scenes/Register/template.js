import React from 'react'
import styled from 'styled-components'

import { SecondaryButton } from 'components/generic/Button'
import { Form, FormGroup, TextBox, PasswordBox, CheckBox, LabelError } from 'components/generic/Form'
import { Link, RouterLink } from 'components/generic/Link'
import { Text } from 'components/generic/Text'
import { Separator } from 'components/generic/Separator'

const Wrapper = styled.div`
  width: 100%;
  padding: 40px;
  box-sigin: border-box;
  background-color: #FFFFFF;

  & > * { padding-bottom: 10px; }

  @media(min-width: 768px) { width: 600px; }
`
const Header = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
`
const Aligned = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
  align-items: center;

  & > * { display: flex; margin-right: 5px; }
`

const Register = (props) => {
  console.log(props.values.terms.checked)
  return (
    <Wrapper>
      <Header>
        <Text id='scenes.register.create' text='Create your Wallet' biggest light />
        <Aligned>
          <Text id='scenes.register.or' text='or' small light />
          <RouterLink to='/'><Text id='scenes.register.login' text='Login' to='/register' small light cyan /></RouterLink>
        </Aligned>
      </Header>
      <Text id='scenes.register.explain' text='Sign up for a free wallet below' small light altFont />
      <Separator />
      <Form>
        <FormGroup id='guid' validationState={props.validation.email} >
          <Text id='scenes.register.email' text='Email' small medium />
          <TextBox name='email' value={props.values.email} onChange={props.onChange} />
          <LabelError id='scenes.register.email_empty' text='Email is required.' error={props.errors.email.empty} />
          <LabelError id='scenes.register.email_invalid' text='Email is invalid.' error={props.errors.email.invalid} />
        </FormGroup>
        <FormGroup id='password' validationState={props.validation.password}>
          <Text id='scenes.register.password' text='Password' small medium />
          <PasswordBox name='password' value={props.values.password} onChange={props.onChange} />
          <LabelError id='scenes.register.password_empty' text='Password is required.' error={props.errors.password.empty} />
          <LabelError id='scenes.register.password_invalid' text='Password is invalid.' error={props.errors.password.invalid} />
        </FormGroup>
        <FormGroup id='confirmationPassword' validationState={props.validation.confirmationPassword}>
          <Text id='scenes.register.confirmationPassword' text='Confirm password' small medium capitalize />
          <PasswordBox name='confirmationPassword' value={props.values.confirmPassword} onChange={props.onChange} />
          <LabelError id='scenes.register.confirmationpassword_empty' text='Password confirmation is required.' error={props.errors.confirmationPassword.empty} />
          <LabelError id='scenes.register.confirmationpassword_invalid' text='Password confirmation does not match initial password.' error={props.errors.confirmationPassword.invalid} />
        </FormGroup>
        <FormGroup id='terms' validationState={props.validation.confirmationPassword}>
          <Aligned>
            <CheckBox name='terms' checked={props.values.terms} onChange={props.onChange} />
            <Text id='scenes.register.read' text='I have read and agree to the' smaller light />
            <Link href='https://blockchain.info/Resources/TermsofServicePolicy.pdf' target='_blank'>
              <Text id='scenes.register.terms' text='Terms of Service' smaller light cyan />
            </Link>
          </Aligned>
        </FormGroup>
        <SecondaryButton id='scenes.register.submit' text='Continue' small medium uppercase white onClick={props.onClick} />
      </Form>
    </Wrapper>
  )
}

export default Register
