import React from 'react'
import { FormattedMessage } from 'react-intl'
import { LinkContainer } from 'react-router-bootstrap'
import { Field } from 'redux-form'

import { Banner, HeartbeatLoader, Link, Text } from 'blockchain-info-components'
import { FormError, FormGroup, FormItem, FormLabel, PasswordBox, TextBox } from 'components/Form'
import { ExchangeErrorCodes, LoginSteps } from 'data/types'
import { isBrowserSupported } from 'services/browser'
import { required } from 'services/forms'

import { Props } from '..'
import {
  ActionButton,
  BackArrowFormHeader,
  CenteredColumn,
  LOGIN_FORM_NAME,
  NeedHelpLink,
  removeWhitespace,
  Row,
  UnsupportedBrowserWarning
} from '../model'

const isSupportedBrowser = isBrowserSupported()

const EnterPasswordExchange = (props: Props) => {
  const { authType, busy, exchangeError, exchangePassword, invalid, submitting } = props
  const passwordError = exchangeError && exchangeError === ExchangeErrorCodes.INVALID_CREDENTIALS
  const twoFactorRequired = exchangeError && exchangeError === ExchangeErrorCodes.EXPECT_2FA
  const twoFactorError = exchangeError && exchangeError === ExchangeErrorCodes.WRONG_2FA

  const handleBackArrowClick = () => {
    props.cacheActions.removedStoredLogin()
    props.formActions.destroy(LOGIN_FORM_NAME)
    props.setStep(LoginSteps.ENTER_EMAIL_GUID)
    props.authActions.clearLoginError()
    props.initCaptcha()
  }
  return (
    <>
      <BackArrowFormHeader {...props} handleBackArrowClick={handleBackArrowClick} hideGuid />
      <FormGroup>
        {!isSupportedBrowser && <UnsupportedBrowserWarning />}
        <FormItem>
          <FormLabel htmlFor='password'>
            <FormattedMessage
              id='scenes.login.enter_password'
              defaultMessage='Enter your password'
            />
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
                defaultMessage='Login failed - invalid credentials.'
              />
              {/* some sort of prompts to reset password?
               {'  '}
              <LinkContainer to='/recover'>
                <Link size='12px' data-e2e='loginRecover'>
                  <FormattedMessage
                    id='scenes.login.recover_account'
                    defaultMessage='Recover account'
                  />
                  .
                </Link>
              </LinkContainer>  */}
            </FormError>
          )}
        </FormItem>
      </FormGroup>
      {twoFactorRequired && (
        <FormGroup>
          <FormItem>
            <FormLabel htmlFor='code'>
              <FormattedMessage
                id='scenes.logins.twofa.enter_code'
                defaultMessage='Enter your Two Factor Authentication Code'
              />
            </FormLabel>
            <Field
              name='code'
              normalize={removeWhitespace}
              validate={[required]}
              component={TextBox}
              noLastPass
              autoFocus
              data-e2e='loginTwoFactorCode'
            />
            {twoFactorError && (
              <FormError position='absolute'>
                <FormattedMessage
                  id='scenes.login.exchange.incorrect_code'
                  defaultMessage='Incorrect code'
                />
              </FormError>
            )}
          </FormItem>
        </FormGroup>
      )}
      <CenteredColumn>
        <ActionButton
          type='submit'
          nature='primary'
          fullwidth
          height='48px'
          disabled={submitting || invalid || busy || !exchangePassword}
          data-e2e='passwordButton'
          style={{ marginBottom: '16px' }}
        >
          {submitting || busy ? (
            <HeartbeatLoader height='20px' width='20px' color='white' />
          ) : (
            <Text color='whiteFade900' size='16px' weight={600}>
              <FormattedMessage id='scenes.login.login' defaultMessage='Log In' />
            </Text>
          )}
        </ActionButton>
        <NeedHelpLink authActions={props.authActions} origin='PASSWORD' />
      </CenteredColumn>
    </>
  )
}

export default EnterPasswordExchange
