import React, { useEffect } from 'react'
import { FormattedMessage } from 'react-intl'
import { LinkContainer } from 'react-router-bootstrap'
import { Field } from 'redux-form'
import styled from 'styled-components'

import { HeartbeatLoader, Link, Text } from 'blockchain-info-components'
import FormError from 'components/Form/FormError'
import FormGroup from 'components/Form/FormGroup'
import FormItem from 'components/Form/FormItem'
import FormLabel from 'components/Form/FormLabel'
import PasswordBox from 'components/Form/PasswordBox'
import TextBox from 'components/Form/TextBox'
import { Wrapper } from 'components/Public'
import { ProductAuthOptions } from 'data/auth/types'
import { Analytics, ExchangeErrorCodes } from 'data/types'
import { required } from 'services/forms'
import { removeWhitespace } from 'services/forms/normalizers'
import { isMobile, media } from 'services/styles'

import { Props } from '../..'
import BackArrowHeader from '../../components/BackArrowHeader'
import NeedHelpLink from '../../components/NeedHelpLink'
import SignupLink from '../../components/SignupLink'
import { ActionButton, CenteredColumn, Row, WrapperWithPadding } from '../../model'
import { getTwoFaType } from '../../utils'

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
    analyticsActions,
    authActions,
    authType,
    busy,
    exchangeError,
    formValues,
    handleBackArrowClickWallet,
    invalid,
    magicLinkData,
    productAuthMetadata,
    submitting,
    walletError
  } = props

  const accountLocked =
    walletError &&
    (walletError.toLowerCase().includes('this account has been locked') ||
      walletError.toLowerCase().includes('account is locked') ||
      walletError.toLowerCase().includes('account deactivated'))
  const sanctionedRegionError = exchangeError && exchangeError === ExchangeErrorCodes.NOT_ACCEPTABLE
  const twoFactorError = walletError && walletError.toLowerCase().includes('authentication code')
  const { product } = productAuthMetadata
  const handleSmsResend = () => {
    const email =
      product === ProductAuthOptions.EXCHANGE ? formValues?.exchangeEmail : formValues.email
    authActions.resendSmsCode({ email, guid: formValues?.guid })
  }

  useEffect(() => {
    const twoFAType = getTwoFaType(authType)
    analyticsActions.trackEvent({
      key: Analytics.LOGIN_2FA_PAGE_VIEWED,
      properties: {
        '2fa_type': twoFAType,
        device_origin: product,
        originalTimestamp: new Date().toISOString()
      }
    })
  }, [])

  return (
    <LoginWrapper>
      <WrapperWithPadding>
        <BackArrowHeader
          {...props}
          handleBackArrowClick={handleBackArrowClickWallet}
          marginTop='28px'
          platform={magicLinkData?.platform_type}
          product={props.productAuthMetadata.product}
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
                      defaultMessage='Two Factor Authentication Code'
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
              {sanctionedRegionError && (
                <FormError data-e2e='sanctionsError' position='absolute'>
                  <FormattedMessage
                    id='scenes.login.exchange.sactions_error'
                    defaultMessage='We are unable to offer services in your region at this time.'
                  />
                </FormError>
              )}
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
            disabled={submitting || invalid || busy || (formValues?.code?.length || 0) < 5}
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
            origin='2FA'
            platform={productAuthMetadata.platform}
            product={ProductAuthOptions.WALLET}
          />
        </CenteredColumn>
      </WrapperWithPadding>
      <SignupLink platform={magicLinkData?.platform_type} />
    </LoginWrapper>
  )
}

export default TwoFAWallet
