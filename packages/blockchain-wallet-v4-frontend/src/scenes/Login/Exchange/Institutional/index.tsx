import React, { useEffect } from 'react'
import { FormattedMessage } from 'react-intl'
import { Field } from 'redux-form'
import styled from 'styled-components'

import { HeartbeatLoader, Icon, Text } from 'blockchain-info-components'
import { FormError, FormGroup, FormItem, FormLabel, PasswordBox, TextBox } from 'components/Form'
import { Wrapper } from 'components/Public'
import { LOGIN_FORM } from 'data/auth/model'
import { ProductAuthOptions } from 'data/auth/types'
import { ExchangeErrorCodes } from 'data/types'
import { required, validEmail } from 'services/forms'
import { removeWhitespace } from 'services/forms/normalizers'
import { media } from 'services/styles'

import { Props } from '../..'
import NeedHelpLink from '../../components/NeedHelpLink'
import SignupLink from '../../components/SignupLink'
import UnsupportedBrowser from '../../components/UnsupportedBrowser'
import { ActionButton, LinkRow, LoginFormLabel, WrapperWithPadding } from '../../model'

const LoginWrapper = styled(Wrapper)`
  padding: 36px 0;
  ${media.mobile`
    padding: 16px 0;
  `}
`
const BackArrowWrapper = styled.div`
  display: flex;
  margin-bottom: 24px;
  align-items: center;
`
const BackArrow = styled.div`
  display: flex;
  align-items: center;
  cursor: pointer;
`

const InstitutionalPortal = (props: Props) => {
  useEffect(() => {
    props.formActions.clearFields(LOGIN_FORM, false, false, 'exchangeEmail')
  }, [])

  const {
    authActions,
    busy,
    exchangeError,
    formValues,
    handleBackArrowClickExchange,
    invalid,
    isBrowserSupported,
    routerActions,
    submitting
  } = props
  const passwordError = exchangeError && exchangeError === ExchangeErrorCodes.INVALID_CREDENTIALS
  const backArrowClick = () => {
    handleBackArrowClickExchange()
    routerActions.push('/login?product=exchange')
  }
  return (
    <LoginWrapper>
      <WrapperWithPadding>
        <FormGroup>
          <BackArrowWrapper>
            <BackArrow onClick={backArrowClick}>
              <Icon
                data-e2e='signupBack'
                name='arrow-back'
                size='24px'
                color='blue600'
                style={{ marginRight: '8px' }}
                role='button'
              />

              <Text color='grey900' size='14px' weight={500} lineHeight='1.5'>
                <FormattedMessage id='copy.back' defaultMessage='Back' />
              </Text>
            </BackArrow>
          </BackArrowWrapper>
          <UnsupportedBrowser isSupportedBrowser={isBrowserSupported} />
          <FormItem style={{ margin: '8px 0 16px' }}>
            <LoginFormLabel htmlFor='exchangeEmail'>
              <FormattedMessage id='copy.email' defaultMessage='Email' />
            </LoginFormLabel>

            <Field
              component={TextBox}
              data-e2e='exchangeEmail'
              disabled={!isBrowserSupported}
              disableSpellcheck
              name='exchangeEmail'
              normalize={removeWhitespace}
              validate={[required, validEmail]}
              placeholder='Enter your email'
              autoFocus
            />
          </FormItem>
          <FormItem>
            <FormLabel htmlFor='password'>
              <FormattedMessage id='scenes.login.password' defaultMessage='Password' />
            </FormLabel>
            <Field
              component={PasswordBox}
              data-e2e='exchangePassword'
              disabled={!isBrowserSupported}
              name='exchangePassword'
              placeholder='Enter your password'
              validate={[required]}
            />
            {passwordError && (
              <FormError data-e2e='passwordError' style={{ paddingTop: '5px' }}>
                <FormattedMessage
                  id='scenes.login.exchange.wrong_password'
                  defaultMessage='Login failed - wrong password.'
                />
                {/* some sort of prompts to reset password?  */}
              </FormError>
            )}
          </FormItem>
        </FormGroup>
        <LinkRow>
          <ActionButton
            type='submit'
            nature='primary'
            fullwidth
            height='48px'
            disabled={submitting || invalid || busy || !formValues?.exchangeEmail}
            data-e2e='loginButton'
            style={{ marginBottom: '16px' }}
          >
            {submitting ? (
              <HeartbeatLoader height='20px' width='20px' color='white' />
            ) : (
              <Text color='whiteFade900' size='16px' weight={600}>
                <FormattedMessage id='buttons.continue' defaultMessage='Continue' />
              </Text>
            )}
          </ActionButton>
          <NeedHelpLink
            authActions={authActions}
            origin='IDENTIFIER'
            product={ProductAuthOptions.EXCHANGE}
          />
        </LinkRow>
      </WrapperWithPadding>
      <SignupLink />
    </LoginWrapper>
  )
}

export default InstitutionalPortal
