import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import { Field, reduxForm } from 'redux-form'
import { FormattedMessage } from 'react-intl'
import { LinkContainer } from 'react-router-bootstrap'

import { required } from 'services/FormHelper'
import { Button, Link, Separator, Text, TextGroup } from 'blockchain-info-components'
import { Form, PasswordBox, TextBox } from 'components/Form'
import Modals from 'modals'
import MobileLogin from 'modals/MobileLogin'

const Wrapper = styled.div`
  width: 100%;
  padding: 40px;
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
  padding: 5px 0;

  @media(min-width: 768px) {
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
  }
`

const Login = (props) => {
  const { submitting, invalid, ...rest } = props
  const { onSubmit, handleMobile, authType } = rest

  return (
    <Wrapper>
      <Modals>
        <MobileLogin />
      </Modals>
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
      <Form onSubmit={onSubmit}>
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
        { authType &&
          <Text size='14px' weight={500}>
            { authType === 1 && <FormattedMessage id='scenes.login.yubikey' defaultMessage='Yubikey' /> }
            { authType === 4 && <FormattedMessage id='scenes.login.google' defaultMessage='Google Authenticator Code' /> }
            { authType === 5 && <FormattedMessage id='scenes.login.mobile' defaultMessage='SMS Code' /> }
          </Text>
        }
        { authType &&
          <Field name='code' validate={[required]} component={TextBox} />
        }
        <Button type='submit' nature='primary' fullwidth uppercase disabled={submitting || invalid}>
          <FormattedMessage id='scenes.login.submit' defaultMessage='Log in' />
        </Button>
      </Form>
      <Footer>
        <Link size='13px' weight={300} onClick={handleMobile}>
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

Login.propTypes = {
  handleMobile: PropTypes.func.isRequired
}

export default reduxForm({ form: 'login' })(Login)
