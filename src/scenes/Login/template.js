import React from 'react'
import styled from 'styled-components'
import { Field, reduxForm } from 'redux-form'
import { FormattedMessage } from 'react-intl'

import { required } from 'services/FormHelper'
import { Button, Form, HelpBlock, Link, PasswordBox, RouterLink, Separator, TextBox } from 'blockchain-info-components'

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
const Footer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: flex-start;
  padding: 5px 0;

  @media(min-width: 768px) {
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
  }
`
const Aligned = styled.div`
  & > * { display: inline-block; margin-right: 5px; }
`

const Login = (props) => {
  const { handleClick, handleTrezor, submitting, invalid } = props

  return (
    <Wrapper>
      <Header>
        <FormattedMessage id='scenes.login.welcome' defaultMessage='Welcome back !' />
        <Aligned>
          <FormattedMessage id='scenes.login.or' defaultMessage='or' />
          <RouterLink to='/register'>
            <FormattedMessage id='scenes.login.register' defaultMessage='Sign up' />
          </RouterLink>
        </Aligned>
      </Header>
      <FormattedMessage id='scenes.login.explain' defaultMessage='Sign in to your wallet below' />
      <Separator />
      <Form>
        <FormattedMessage id='scenes.login.guid' defaultMessage='Wallet ID' />
        <Field name='guid' validate={[required]} component={TextBox} />
        <HelpBlock>
          <FormattedMessage id='scenes.login.info' defaultMessage='Find the login link in your email,' />
          <FormattedMessage id='scenes.login.info2' defaultMessage='e.g. blockchain.info/wallet/1111-222-333...' />
          <FormattedMessage id='scenes.login.info3' defaultMessage='The series of numbers and dashes at the end of the link is your Wallet ID.' />
        </HelpBlock>
        <FormattedMessage id='scenes.login.password' defaultMessage='Password' />
        <Field name='password' validate={[required]} component={PasswordBox} />
        <Button type='secondary' fullwidth uppercase disabled={submitting || invalid} onClick={handleClick}>
          <FormattedMessage id='scenes.login.submit' defaultMessage='Log in' />
        </Button>
        <Button type='primary' fullwidth uppercase onClick={handleTrezor}>
          <FormattedMessage id='scenes.login.trezor' defaultMessage='Trezor' />
        </Button>
      </Form>
      <Footer>
        <Link>
          <FormattedMessage id='scenes.login.loginmobile' defaultMessage='Login via mobile' />
        </Link>
        <Aligned>
          <FormattedMessage id='scenes.login.troubles' defaultMessage='Having some troubles?' />
          <RouterLink to='/help'>
            <FormattedMessage id='scenes.login.options' defaultMessage='View options' />
          </RouterLink>
        </Aligned>
      </Footer>
    </Wrapper>
  )
}

export default reduxForm({ form: 'loginForm' })(Login)
