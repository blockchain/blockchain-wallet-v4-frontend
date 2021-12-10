import React from 'react'
import { FormattedMessage } from 'react-intl'
import { Field } from 'redux-form'
import styled from 'styled-components'

import { HeartbeatLoader, Image, Text } from 'blockchain-info-components'
import { FormError, FormGroup, FormItem, FormLabel, PasswordBox, TextBox } from 'components/Form'
import { Wrapper } from 'components/Public'
import { ExchangeErrorCodes, LoginSteps, ProductAuthOptions } from 'data/types'
import { isBrowserSupported } from 'services/browser'
import { required } from 'services/forms'
import { media } from 'services/styles'

import { Props } from '../..'
import {
  ActionButton,
  BackArrowFormHeader,
  CenteredColumn,
  ExchangeNeedHelpLink,
  ProductTab,
  removeWhitespace,
  SignUpLink,
  TabWrapper,
  UnsupportedBrowserWarning,
  WrapperWithPadding
} from '../../model'

const isSupportedBrowser = isBrowserSupported()

const LoginWrapper = styled(Wrapper)`
  padding: 0 0 32px 0;
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
    handleBackArrowClick,
    invalid,
    submitting
  } = props
  const passwordError = exchangeError && exchangeError === ExchangeErrorCodes.INVALID_CREDENTIALS

  return (
    <LoginWrapper>
      <TabWrapper>
        <ProductTab backgroundColor='grey000' onClick={authActions.setCachedWalletData}>
          <Image name='wallet-grayscale' height='28px' style={{ marginRight: '12px' }} />
          <Text size='20px' weight={600} color='grey400'>
            <FormattedMessage id='copy.wallet' defaultMessage='Wallet' />
          </Text>
        </ProductTab>
        <ProductTab>
          <Image name='exchange-no-background' height='26px' style={{ marginRight: '12px' }} />
          <Text size='20px' weight={600} color='blue600'>
            <FormattedMessage id='copy.exchange' defaultMessage='Exchange' />
          </Text>
        </ProductTab>
      </TabWrapper>
      <WrapperWithPadding>
        <BackArrowFormHeader
          {...props}
          handleBackArrowClick={handleBackArrowClick}
          hideGuid
          marginTop='28px'
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
          <ExchangeNeedHelpLink authActions={authActions} origin='PASSWORD' />
        </CenteredColumn>
      </WrapperWithPadding>
      <SignUpLink />
    </LoginWrapper>
  )
}

export default EnterPasswordExchange
