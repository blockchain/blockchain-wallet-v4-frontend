import React from 'react'
import { FormattedMessage } from 'react-intl'
import { Field } from 'redux-form'
import styled from 'styled-components'

import { HeartbeatLoader, Text } from 'blockchain-info-components'
import { FormError, FormGroup, FormItem, FormLabel, PasswordBox, TextBox } from 'components/Form'
import { Wrapper } from 'components/Public'
import { ExchangeErrorCodes } from 'data/types'
import { isBrowserSupported } from 'services/browser'
import { required, validEmail } from 'services/forms'
import { media } from 'services/styles'

import { Props } from '../..'
import {
  ActionButton,
  BackArrowSimple,
  ExchangeNeedHelpLink,
  LinkRow,
  LoginFormLabel,
  removeWhitespace,
  SignUpLink,
  UnsupportedBrowserWarning,
  WrapperWithPadding
} from '../../model'

const isSupportedBrowser = isBrowserSupported()

const LoginWrapper = styled(Wrapper)`
  padding: 36px 0;
  ${media.mobile`
    padding: 0 0 16px 0;
  `}
`

const InstitutionalPortal = (props: Props) => {
  const {
    authActions,
    busy,
    exchangeError,
    formValues,
    handleBackArrowClick,
    invalid,
    submitting
  } = props
  const passwordError = exchangeError && exchangeError === ExchangeErrorCodes.INVALID_CREDENTIALS
  return (
    <LoginWrapper>
      <WrapperWithPadding>
        <FormGroup>
          <BackArrowSimple handleBackArrowClick={handleBackArrowClick} />
          {!isSupportedBrowser && <UnsupportedBrowserWarning />}
          <FormItem style={{ margin: '8px 0 16px' }}>
            <LoginFormLabel htmlFor='email'>
              <FormattedMessage id='copy.email' defaultMessage='Email' />
            </LoginFormLabel>

            <Field
              component={TextBox}
              data-e2e='exchangeEmail'
              disabled={!isSupportedBrowser}
              disableSpellcheck
              name='email'
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
              name='exchangePassword'
              disabled={!isSupportedBrowser}
              validate={[required]}
              component={PasswordBox}
              data-e2e='exchangePassword'
              autoFocus
              placeholder='Enter your password'
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
            disabled={submitting || invalid || busy || !formValues?.email}
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
          <ExchangeNeedHelpLink authActions={authActions} origin='IDENTIFIER' />
        </LinkRow>
      </WrapperWithPadding>
      <SignUpLink />
    </LoginWrapper>
  )
}

export default InstitutionalPortal
