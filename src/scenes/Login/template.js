import React from 'react'
import styled from 'styled-components'
import { compose } from 'redux'
import { Field, reduxForm } from 'redux-form'
import { FormattedMessage } from 'react-intl'
import { LinkContainer } from 'react-router-bootstrap'

import { required } from 'services/FormHelper'
import { Button, Link, Separator, Text, TextGroup } from 'blockchain-info-components'
import { Form, PasswordBox, TextBox } from 'components/Form'

const Wrapper = styled.div`
  width: 100%;
  padding: 40px;
  box-sigin: border-box;
  background-color: ${props => props.theme['white']};

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

const Login = (props) => {
  const { handleSubmit, handleTrezor, submitting, invalid } = props

  return (
    <Wrapper>
      <Header>
        <Text size='24px' weight={300} capitalize>
          <FormattedMessage id='scenes.login.welcome' defaultMessage='Welcome back !' />
        </Text>
        <TextGroup inline>
          <Text size='13px' weight={300}>
            <FormattedMessage id='scenes.login.or' defaultMessage='or' />
          </Text>
          <LinkContainer to='/register'>
            <Link size='13px' weight={300}>
              <FormattedMessage id='scenes.login.register' defaultMessage='Sign up' />
            </Link>
          </LinkContainer>
        </TextGroup>
      </Header>
      <Text size='16px' weight={300} altFont>
        <FormattedMessage id='scenes.login.explain' defaultMessage='Sign in to your wallet below' />
      </Text>
      <Separator />
      <Form onSubmit={handleSubmit}>
        <Text size='14px' weight={500}>
          <FormattedMessage id='scenes.login.guid' defaultMessage='Wallet ID' />
        </Text>
        <Field name='guid' validate={[required]} component={TextBox} />
        <TextGroup inline>
          <Text size='14px' weight={300} altFont>
            <FormattedMessage id='scenes.login.info' defaultMessage='Find the login link in your email,' />
          </Text>
          <Text size='14px' weight={300} altFont>
            <FormattedMessage id='scenes.login.info2' defaultMessage='e.g. blockchain.info/wallet/1111-222-333...' />
          </Text>
          <Text size='14px' weight={300} altFont>
            <FormattedMessage id='scenes.login.info3' defaultMessage='The series of numbers and dashes at the end of the link is your Wallet ID.' />
          </Text>
        </TextGroup>
        <Text size='14px' weight={500}>
          <FormattedMessage id='scenes.login.password' defaultMessage='Password' />
        </Text>
        <Field name='password' validate={[required]} component={PasswordBox} />
        <Button nature='secondary' type='submit' fullwidth uppercase disabled={submitting || invalid}>
          <FormattedMessage id='scenes.login.submit' defaultMessage='Log in' />
        </Button>
        <Button nature='primary' fullwidth uppercase onClick={handleTrezor}>
          <FormattedMessage id='scenes.login.trezor' defaultMessage='Trezor' />
        </Button>
      </Form>
      <Footer>
        <Link size='13px' weight={300}>
          <FormattedMessage id='scenes.login.loginmobile' defaultMessage='Login via mobile' />
        </Link>
        <TextGroup inline>
          <Text size='13px' weight={300}>
            <FormattedMessage id='scenes.login.troubles' defaultMessage='Having some troubles?' />
          </Text>
          <LinkContainer to='/help'>
            <Link size='13px' weight={300}>
              <FormattedMessage id='scenes.login.options' defaultMessage='View options' />
            </Link>
          </LinkContainer>
        </TextGroup>
      </Footer>
    </Wrapper>
  )
}

export default reduxForm({ form: 'loginForm' })(Login)
