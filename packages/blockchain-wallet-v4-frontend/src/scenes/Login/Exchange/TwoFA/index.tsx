import React, { useEffect } from 'react'
import { FormattedMessage } from 'react-intl'
import { Field } from 'redux-form'
import styled from 'styled-components'

import { HeartbeatLoader, Text } from 'blockchain-info-components'
import FormError from 'components/Form/FormError'
import FormGroup from 'components/Form/FormGroup'
import FormItem from 'components/Form/FormItem'
import FormLabel from 'components/Form/FormLabel'
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
import { ActionButton, LinkRow, WrapperWithPadding } from '../../model'
import { getTwoFaType } from '../../utils'

const LoginWrapper = styled(Wrapper)`
  padding: 32px 0 24px;
  ${media.mobile`
    padding: 24px 0;
  `}
`
const TwoFAExchange = (props: Props) => {
  const {
    analyticsActions,
    authType,
    busy,
    cache,
    exchangeError,
    formValues,
    handleBackArrowClickExchange,
    invalid,
    magicLinkData,
    productAuthMetadata,
    submitting
  } = props
  const twoFactorError = exchangeError && exchangeError === ExchangeErrorCodes.WRONG_2FA

  useEffect(() => {
    const twoFAType = getTwoFaType(authType)
    analyticsActions.trackEvent({
      key: Analytics.LOGIN_2FA_PAGE_VIEWED,
      properties: {
        '2fa_type': twoFAType,
        device_origin: productAuthMetadata?.product || 'WEB',
        originalTimestamp: new Date().toISOString()
      }
    })
  }, [])

  return (
    <LoginWrapper>
      <WrapperWithPadding>
        <BackArrowHeader
          {...props}
          handleBackArrowClick={handleBackArrowClickExchange}
          hideGuid
          platform={magicLinkData?.platform_type}
        />
        <FormGroup>
          <FormItem>
            <FormLabel htmlFor='code'>
              {isMobile() ? (
                <FormattedMessage
                  id='scenes.logins.twofa.enter_code.mobile_width'
                  defaultMessage='Two Factor Authentication Code'
                />
              ) : (
                <FormattedMessage
                  id='scenes.logins.twofa.enter_code'
                  defaultMessage='Enter your Two Factor Authentication Code'
                />
              )}
            </FormLabel>
            <Field
              name='exchangeTwoFA'
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
        <LinkRow>
          <ActionButton
            type='submit'
            nature='primary'
            fullwidth
            height='48px'
            disabled={submitting || invalid || busy || (formValues?.exchangeTwoFA?.length || 0) < 6}
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
            origin='2FA'
            platform={productAuthMetadata.platform}
            product={ProductAuthOptions.EXCHANGE}
            unified={cache.unifiedAccount}
          />
        </LinkRow>
      </WrapperWithPadding>
      <SignupLink platform={magicLinkData?.platform_type} />
    </LoginWrapper>
  )
}

export default TwoFAExchange
