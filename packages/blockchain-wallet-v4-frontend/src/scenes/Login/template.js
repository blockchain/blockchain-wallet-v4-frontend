import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import { Field, reduxForm } from 'redux-form'
import { FormattedMessage } from 'react-intl'
import { LinkContainer } from 'react-router-bootstrap'

import { required } from 'services/FormHelper'
import { Button, Link, Separator, Text, TextGroup, HeartbeatLoader } from 'blockchain-info-components'
import { Form, FormGroup, FormItem, FormLabel, PasswordBox, TextBox } from 'components/Form'
import Modals from 'modals'
import MobileLogin from 'modals/MobileLogin'

const Wrapper = styled.div`
  width: 100%;
  padding: 35px;
  box-sizing: border-box;
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
  margin-top: 15px;

  @media(min-width: 768px) {
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
  }
`
const LoginForm = styled(Form)`
  margin: 20px 0;
`
const LoginButton = styled(Button)`
  margin-top: 15px;
`
const LoginTextGroup = styled(TextGroup)`
  line-height: 1;
  margin-top: 3px;
`

const Login = (props) => {
  const { submitting, invalid, busy, ...rest } = props
  const { onSubmit, handleMobile, authType } = rest

  return (
    <Wrapper>
      <Modals>
        <MobileLogin />
      </Modals>
      <Header>
        <Text size='24px' weight={300} capitalize>
          <FormattedMessage id='scenes.login.welcome' defaultMessage='Welcome back!' />
        </Text>
        <TextGroup inline>
          <Text size='13px' weight={300}>
            <FormattedMessage id='scenes.login.or' defaultMessage='or' />
          </Text>
          <LinkContainer to='/signup'>
            <Link size='13px' weight={300}>
              <FormattedMessage id='scenes.login.register' defaultMessage='Sign Up' />
            </Link>
          </LinkContainer>
        </TextGroup>
      </Header>
      <Text size='14px' weight={300} altFont>
        <FormattedMessage id='scenes.login.explain' defaultMessage='Sign in to your wallet below' />
      </Text>
      <Separator />
      <LoginForm override onSubmit={onSubmit}>
        <FormGroup>
          <FormItem>
            <FormLabel for='guid'>
              <FormattedMessage id='scenes.login.guid' defaultMessage='Wallet ID' />
            </FormLabel>
            <Field name='guid' validate={[required]} component={TextBox} />
          </FormItem>
          <LoginTextGroup inline>
            <Text size='12px' color={'gray-3'} weight={300} altFont>
              <FormattedMessage id='scenes.login.info' defaultMessage='Find the login link in your email,' />
            </Text>
            <Text size='12px' color={'gray-3'} weight={300} altFont>
              <FormattedMessage id='scenes.login.info2' defaultMessage='e.g. blockchain.info/wallet/1111-222-333...' />
            </Text>
            <Text size='12px' color={'gray-3'} weight={300} altFont>
              <FormattedMessage id='scenes.login.info3' defaultMessage='The series of numbers and dashes at the end of the link is your Wallet ID.' />
            </Text>
          </LoginTextGroup>
        </FormGroup>
        <FormGroup>
          <FormItem>
            <FormLabel for='password'>
              <FormattedMessage id='scenes.login.password' defaultMessage='Password' />
            </FormLabel>
            <Field name='password' validate={[required]} component={PasswordBox} />
          </FormItem>
        </FormGroup>
        <FormGroup>
          { authType > 0 &&
            <FormItem>
              <FormLabel for='code'>
                { authType === 1 && <FormattedMessage id='scenes.login.yubikey' defaultMessage='Yubikey' /> }
                { authType === 4 && <FormattedMessage id='scenes.login.google' defaultMessage='Authenticator App Code' /> }
                { authType === 5 && <FormattedMessage id='scenes.login.mobile' defaultMessage='SMS Code' /> }
              </FormLabel>
            </FormItem>
          }
          { authType > 0 &&
            <Field name='code' validate={[required]} component={TextBox} />
          }
        </FormGroup>
        <FormGroup>
          <LoginButton type='submit' nature='primary' fullwidth uppercase disabled={submitting || invalid}>
            {
              busy
                ? <HeartbeatLoader height='20px' width='20px' color='white' />
                : <FormattedMessage id='scenes.login.submit' defaultMessage='Log in' />
            }
          </LoginButton>
        </FormGroup>
      </LoginForm>
      <Footer>
        <Link size='13px' weight={300} onClick={handleMobile}>
          <FormattedMessage id='scenes.login.loginmobile' defaultMessage='Login via Mobile' />
        </Link>
        <TextGroup inline>
          <Text size='13px' weight={300}>
            <FormattedMessage id='scenes.login.troubles' defaultMessage='Having some troubles?' />
          </Text>
          <LinkContainer to='/help'>
            <Link size='13px' weight={300}>
              <FormattedMessage id='scenes.login.options' defaultMessage='View Options' />
            </Link>
          </LinkContainer>
        </TextGroup>
      </Footer>
    </Wrapper>
  )
}

Login.propTypes = {
  handleMobile: PropTypes.func.isRequired
}

export default reduxForm({ form: 'login' })(Login)
