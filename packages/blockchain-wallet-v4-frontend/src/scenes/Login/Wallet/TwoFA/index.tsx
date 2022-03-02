import React from 'react'
import { FormattedMessage } from 'react-intl'
import { LinkContainer } from 'react-router-bootstrap'
import { Field } from 'redux-form'
import styled from 'styled-components'

import { HeartbeatLoader, Link, Text } from 'blockchain-info-components'
import { FormError, FormGroup, FormItem, FormLabel, PasswordBox, TextBox } from 'components/Form'
import { Wrapper } from 'components/Public'
import { ProductAuthOptions } from 'data/auth/types'
import { required } from 'services/forms'
import { removeWhitespace } from 'services/forms/normalizers'
import { isMobile, media } from 'services/styles'

import { Props } from '../..'
import BackArrowHeader from '../../components/BackArrowHeader'
import NeedHelpLink from '../../components/NeedHelpLink'
import SignupLink from '../../components/SignupLink'
import { ActionButton, CenteredColumn, Row, WrapperWithPadding } from '../../model'

const LoginWrapper = styled(Wrapper)`
  display: flex;
  flex-direction: column;
  padding: 0 0 24px 0;
`
const ResponsiveRow = styled(Row)`
  justify-content: center;
  margin-top: 16px;
  ${media.mobile`
    flex-direction: column;
    align-items: center;
    line-height: 2;
  `}
`

const TwoFAWallet = (props: Props) => {
  const {
    authActions,
    authType,
    busy,
    formValues,
    handleBackArrowClickWallet,
    invalid,
    submitting,
    walletError
  } = props

  const accountLocked =
    walletError &&
    (walletError.toLowerCase().includes('this account has been locked') ||
      walletError.toLowerCase().includes('account is locked'))

  const twoFactorError = walletError && walletError.toLowerCase().includes('authentication code')
  const handleSmsResend = () => {
    authActions.resendSmsCode({ email: formValues?.email, guid: formValues?.guid })
  }

  return (
    <LoginWrapper>
      <WrapperWithPadding>
        <BackArrowHeader
          {...props}
          handleBackArrowClick={handleBackArrowClickWallet}
          marginTop='28px'
        />
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
                {(authType === 4 || authType === 5) &&
                  (isMobile() ? (
                    <FormattedMessage
                      id='scenes.logins.twofa.enter_code.mobile_width'
                      defaultMessage='Enter your 2FA Code'
                    />
                  ) : (
                    <FormattedMessage
                      id='scenes.logins.twofa.enter_code'
                      defaultMessage='Enter your Two Factor Authentication Code'
                    />
                  ))}
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
            <ResponsiveRow>
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
            </ResponsiveRow>
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
          <NeedHelpLink
            authActions={authActions}
            origin='2FA'
            product={ProductAuthOptions.WALLET}
          />
        </CenteredColumn>
      </WrapperWithPadding>
      <SignupLink />
    </LoginWrapper>
  )
}

export default TwoFAWallet
