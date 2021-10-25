import React from 'react'
import { FormattedMessage } from 'react-intl'
import { connect } from 'react-redux'
import { LinkContainer } from 'react-router-bootstrap'
import { Field } from 'redux-form'

import { RemoteDataType } from '@core/types'
import { HeartbeatLoader, Link, Text } from 'blockchain-info-components'
import { FormError, FormGroup, FormItem, FormLabel, PasswordBox, TextBox } from 'components/Form'
import { selectors } from 'data'
import { isBrowserSupported } from 'services/browser'
import { required } from 'services/forms'

import { Props } from '../..'
import {
  ActionButton,
  BackArrowFormHeader,
  CenteredColumn,
  NeedHelpLink,
  removeWhitespace,
  Row,
  UnsupportedBrowserWarning
} from '../../model'

const isSupportedBrowser = isBrowserSupported()

const EnterPasswordWallet = (props: Props) => {
  const {
    authActions,
    authType,
    busy,
    formValues,
    handleBackArrowClick,
    invalid,
    isMobileViewLogin,
    submitting,
    walletError
  } = props

  const passwordError = walletError && walletError.toLowerCase().includes('wrong_wallet_password')
  const accountLocked =
    walletError &&
    (walletError.toLowerCase().includes('this account has been locked') ||
      walletError.toLowerCase().includes('account is locked'))

  const twoFactorError = walletError && walletError.toLowerCase().includes('authentication code')
  const handleSmsResend = () => {
    authActions.resendSmsCode({ email: formValues?.email, guid: formValues?.guid })
  }
  return (
    <>
      <BackArrowFormHeader
        {...props}
        handleBackArrowClick={handleBackArrowClick}
        hideGuid={isMobileViewLogin}
        hideBackArrow={isMobileViewLogin}
      />
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
          {accountLocked && (
            <FormError position='relative'>{walletError?.split('.')[0]}.</FormError>
          )}
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
            {twoFactorError && <FormError position='absolute'>{walletError}</FormError>}
            {accountLocked && (
              <FormError position='absolute'>{walletError?.split('.')[0]}.</FormError>
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
          disabled={submitting || invalid || busy || !formValues?.password}
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
        <NeedHelpLink authActions={authActions} origin='PASSWORD' />
      </CenteredColumn>
    </>
  )
}

const mapStateToProps = (state) => ({
  walletLoginData: selectors.auth.getLogin(state) as RemoteDataType<any, any>
})

const connector = connect(mapStateToProps)

export default connector(EnterPasswordWallet)
