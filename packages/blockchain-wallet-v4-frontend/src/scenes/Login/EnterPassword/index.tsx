import React from 'react'
import { FormattedMessage } from 'react-intl'
import { LinkContainer } from 'react-router-bootstrap'
import { Field } from 'redux-form'

import { Banner, HeartbeatLoader, Link, Text } from 'blockchain-info-components'
import { FormError, FormGroup, FormItem, FormLabel, PasswordBox, TextBox } from 'components/Form'
import { LoginSteps } from 'data/types'
import { isBrowserSupported } from 'services/browser'
import { required } from 'services/forms'

import { Props } from '..'
import {
  ActionButton,
  BackArrowFormHeader,
  BrowserWarning,
  CenteredColumn,
  LOGIN_FORM_NAME,
  NeedHelpLink,
  removeWhitespace,
  Row
} from '../model'

const isSupportedBrowser = isBrowserSupported()

const EnterPassword = (props: Props) => {
  const { authType, busy, formValues, guid, invalid, loginError, password, submitting } = props
  const passwordError = loginError && loginError.toLowerCase().includes('wrong_wallet_password')
  const accountLocked =
    loginError &&
    (loginError.toLowerCase().includes('this account has been locked') ||
      loginError.toLowerCase().includes('account is locked'))

  const twoFactorError = loginError && loginError.toLowerCase().includes('authentication code')
  const handleSmsResend = () => {
    props.authActions.resendSmsCode(guid, formValues?.email)
  }

  const handleBackArrowClick = () => {
    props.cacheActions.removedStoredLogin()
    props.formActions.destroy(LOGIN_FORM_NAME)
    props.setStep(LoginSteps.ENTER_EMAIL_GUID)
    props.authActions.clearLoginError()
    props.initCaptcha()
  }

  return (
    <>
      <BackArrowFormHeader {...props} handleBackArrowClick={handleBackArrowClick} />
      <FormGroup>
        {!isSupportedBrowser && (
          <BrowserWarning>
            <Banner type='warning'>
              <FormattedMessage
                id='scenes.login.browserwarning'
                defaultMessage='Your browser is not supported. Please update to at least Chrome 45, Firefox 45, Safari 8, Edge, or Opera.'
              />
            </Banner>
          </BrowserWarning>
        )}
        <FormItem>
          <FormLabel htmlFor='password'>
            <FormattedMessage
              id='scenes.login.enter_password'
              defaultMessage='Enter your password'
            />
          </FormLabel>
          <Field
            name='password'
            disabled={!isSupportedBrowser}
            validate={[required]}
            component={PasswordBox}
            data-e2e='loginPassword'
            autoFocus
            placeholder='Enter your password'
          />
          {passwordError && (
            <FormError data-e2e='passwordError' style={{ paddingTop: '5px' }}>
              <FormattedMessage
                id='scenes.login.wrong_password_recover'
                defaultMessage='Wrong password. Do you want to recover your wallet using Secret Private Key Recovery Phrase?'
              />
              {'  '}
              <LinkContainer to='/recover'>
                <Link size='12px' data-e2e='loginRecover'>
                  <FormattedMessage
                    id='scenes.login.recover_account'
                    defaultMessage='Recover account'
                  />
                  .
                </Link>
              </LinkContainer>
            </FormError>
          )}
          {accountLocked && <FormError position='relative'>{loginError?.split('.')[0]}.</FormError>}
        </FormItem>
      </FormGroup>
      {authType > 0 && (
        <FormGroup>
          <FormItem>
            <FormLabel htmlFor='code'>
              {authType === 1 && (
                <FormattedMessage
                  id='scenes.login.yubikey_verify'
                  defaultMessage='Verify with your Yubikey'
                />
              )}
              {(authType === 4 || authType === 5) && (
                <FormattedMessage
                  id='scenes.logins.twofa.enter_code'
                  defaultMessage='Enter your Two Factor Authentication Code'
                />
              )}
            </FormLabel>
            <Field
              name='code'
              normalize={removeWhitespace}
              validate={[required]}
              component={authType === 1 ? PasswordBox : TextBox}
              noLastPass
              autoFocus
              data-e2e='loginTwoFactorCode'
            />
            {authType === 5 && (
              <Link size='12px' weight={400} onClick={handleSmsResend}>
                <FormattedMessage id='scenes.login.resendsms' defaultMessage='Resend SMS' />
              </Link>
            )}
            {twoFactorError && <FormError position='absolute'>{loginError}</FormError>}
            {accountLocked && (
              <FormError position='absolute'>{loginError?.split('.')[0]}.</FormError>
            )}
          </FormItem>
          <Row style={{ marginTop: '16px' }}>
            <Text size='14px' weight={600} color='grey600' style={{ marginRight: '4px' }}>
              <FormattedMessage
                id='scenes.logins.twofa.lost'
                defaultMessage='Lost access to your 2FA device?'
              />
            </Text>
            <LinkContainer to='/reset-2fa'>
              <Link size='14px' weight={600} data-e2e='reset2fa'>
                <FormattedMessage id='copy.reset_now' defaultMessage='Reset Now' />
              </Link>
            </LinkContainer>
          </Row>
        </FormGroup>
      )}
      <CenteredColumn>
        <ActionButton
          type='submit'
          nature='primary'
          fullwidth
          height='48px'
          disabled={submitting || invalid || busy || !password}
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

export default EnterPassword
