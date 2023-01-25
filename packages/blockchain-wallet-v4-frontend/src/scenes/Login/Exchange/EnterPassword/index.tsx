import React, { useEffect } from 'react'
import { FormattedMessage } from 'react-intl'
import { Field } from 'redux-form'
import styled from 'styled-components'

import { HeartbeatLoader, Text } from 'blockchain-info-components'
import FormError from 'components/Form/FormError'
import FormGroup from 'components/Form/FormGroup'
import FormItem from 'components/Form/FormItem'
import FormLabel from 'components/Form/FormLabel'
import PasswordBox from 'components/Form/PasswordBox'
import { Wrapper } from 'components/Public'
import { Analytics, ExchangeErrorCodes, ProductAuthOptions } from 'data/types'
import { required } from 'services/forms'
import { media } from 'services/styles'

import { Props } from '../..'
import BackArrowHeader from '../../components/BackArrowHeader'
import NeedHelpLink from '../../components/NeedHelpLink'
import ProductTabMenu from '../../components/ProductTabMenu'
import SignupLink from '../../components/SignupLink'
import { ActionButton, CenteredColumn, WrapperWithPadding } from '../../model'

const LoginWrapper = styled(Wrapper)`
  padding: 0 0 24px 0;
  ${media.mobile`
    padding: 0 0 16px 0;
  `}
`

const EnterPasswordExchange = (props: Props) => {
  const {
    analyticsActions,
    cache,
    exchangeError,
    formValues,
    handleBackArrowClickExchange,
    invalid,
    magicLinkData,
    productAuthMetadata,
    submitting,
    walletTabClicked
  } = props

  useEffect(() => {
    analyticsActions.trackEvent({
      key: Analytics.LOGIN_PASSWORD_INPUT_PAGE_ENTERED,
      properties: {
        device_origin: productAuthMetadata?.product || 'WEB',
        originalTimestamp: new Date().toISOString()
      }
    })
  }, [])

  const passwordError = exchangeError && exchangeError === ExchangeErrorCodes.INVALID_CREDENTIALS
  const sanctionedRegionError = exchangeError && exchangeError === ExchangeErrorCodes.NOT_ACCEPTABLE

  return (
    <LoginWrapper>
      <ProductTabMenu
        active={ProductAuthOptions.EXCHANGE}
        onWalletTabClick={walletTabClicked}
        platform={magicLinkData?.platform_type}
        product={ProductAuthOptions.EXCHANGE}
      />
      <WrapperWithPadding>
        <BackArrowHeader
          {...props}
          handleBackArrowClick={handleBackArrowClickExchange}
          hideGuid
          marginTop='28px'
          platform={magicLinkData?.platform_type}
          product={ProductAuthOptions.EXCHANGE}
        />
        <FormGroup>
          <FormItem>
            <FormLabel htmlFor='password'>
              <FormattedMessage id='scenes.login.your_password' defaultMessage='Your Password' />
            </FormLabel>
            <Field
              autoFocus
              component={PasswordBox}
              data-e2e='exchangePassword'
              name='exchangePassword'
              placeholder='Enter Password'
              validate={[required]}
            />
            {passwordError && (
              <FormError data-e2e='passwordError' style={{ paddingTop: '4px' }}>
                <FormattedMessage
                  id='scenes.login.exchange.wrong_password'
                  defaultMessage='Login failed - wrong password.'
                />
                {/* some sort of prompts to reset password?  */}
              </FormError>
            )}
            {sanctionedRegionError && (
              <FormError data-e2e='sanctionsError' style={{ paddingTop: '4px' }}>
                <FormattedMessage
                  id='scenes.login.exchange.sactions_error'
                  defaultMessage='We are unable to offer services in your region at this time.'
                />
              </FormError>
            )}
          </FormItem>
        </FormGroup>
        <CenteredColumn>
          <ActionButton
            type='submit'
            nature='primary'
            fullwidth
            height='48px'
            disabled={submitting || invalid || !formValues?.exchangePassword}
            data-e2e='passwordButton'
            style={{ marginBottom: '16px' }}
          >
            {submitting ? (
              <HeartbeatLoader height='20px' width='20px' color='white' />
            ) : (
              <Text color='whiteFade900' size='16px' weight={600}>
                <FormattedMessage id='scenes.login.login' defaultMessage='Log In' />
              </Text>
            )}
          </ActionButton>
          <NeedHelpLink
            origin='PASSWORD'
            platform={productAuthMetadata.platform}
            product={ProductAuthOptions.EXCHANGE}
            unified={cache.unifiedAccount}
          />
        </CenteredColumn>
      </WrapperWithPadding>
      <SignupLink platform={magicLinkData?.platform_type} />
    </LoginWrapper>
  )
}

export default EnterPasswordExchange
