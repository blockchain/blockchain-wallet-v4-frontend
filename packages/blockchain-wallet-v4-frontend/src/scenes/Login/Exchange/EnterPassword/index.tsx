import React from 'react'
import { FormattedMessage } from 'react-intl'
import { Field } from 'redux-form'
import styled from 'styled-components'

import { HeartbeatLoader, Text } from 'blockchain-info-components'
import { FormError, FormGroup, FormItem, FormLabel, PasswordBox } from 'components/Form'
import { Wrapper } from 'components/Public'
import { ExchangeErrorCodes, ProductAuthOptions } from 'data/types'
import { required } from 'services/forms'
import { media } from 'services/styles'

import { Props } from '../..'
import BackArrowHeader from '../../components/BackArrowHeader'
import NeedHelpLink from '../../components/NeedHelpLink'
import ProductTabMenu from '../../components/ProductTabMenu'
import SignupLink from '../../components/SignupLink'
import UnsupportedBrowser from '../../components/UnsupportedBrowser'
import { ActionButton, CenteredColumn, WrapperWithPadding } from '../../model'

const LoginWrapper = styled(Wrapper)`
  padding: 0 0 24px 0;
  ${media.mobile`
    padding: 0 0 16px 0;
  `}
`

const EnterPasswordExchange = (props: Props) => {
  const {
    authActions,
    busy,
    exchangeError,
    formValues,
    handleBackArrowClickExchange,
    invalid,
    isBrowserSupported,
    submitting,
    walletTabClicked
  } = props
  const passwordError = exchangeError && exchangeError === ExchangeErrorCodes.INVALID_CREDENTIALS

  return (
    <LoginWrapper>
      <ProductTabMenu active={ProductAuthOptions.EXCHANGE} onWalletTabClick={walletTabClicked} />
      <WrapperWithPadding>
        <BackArrowHeader
          {...props}
          handleBackArrowClick={handleBackArrowClickExchange}
          hideGuid
          marginTop='28px'
          product={ProductAuthOptions.EXCHANGE}
        />
        <FormGroup>
          <UnsupportedBrowser isSupportedBrowser={isBrowserSupported} />
          <FormItem>
            <FormLabel htmlFor='password'>
              <FormattedMessage id='scenes.login.your_password' defaultMessage='Your Password' />
            </FormLabel>
            <Field
              autoFocus
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
        <CenteredColumn>
          <ActionButton
            type='submit'
            nature='primary'
            fullwidth
            height='48px'
            disabled={submitting || invalid || busy || !formValues?.exchangePassword}
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
            origin='PASSWORD'
            product={ProductAuthOptions.EXCHANGE}
          />
        </CenteredColumn>
      </WrapperWithPadding>
      <SignupLink />
    </LoginWrapper>
  )
}

export default EnterPasswordExchange
