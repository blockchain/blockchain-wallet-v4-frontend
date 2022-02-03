import React from 'react'
import { FormattedMessage } from 'react-intl'
import { Field } from 'redux-form'
import styled from 'styled-components'

import { HeartbeatLoader, Text } from 'blockchain-info-components'
import { FormGroup, FormItem, TextBox } from 'components/Form'
import { Wrapper } from 'components/Public'
import { LOGIN_FORM } from 'data/auth/model'
import { ProductAuthOptions } from 'data/types'
import { required, validWalletIdOrEmail } from 'services/forms'
import { removeWhitespace } from 'services/forms/normalizers'
import { media } from 'services/styles'

import { Props } from '../..'
import NeedHelpLink from '../../components/NeedHelpLink'
import ProductTabMenu from '../../components/ProductTabMenu'
import SignupLink from '../../components/SignupLink'
import UnsupportedBrowser from '../../components/UnsupportedBrowser'
import { ActionButton, GuidError, LinkRow, LoginFormLabel, WrapperWithPadding } from '../../model'

const LoginWrapper = styled(Wrapper)`
  display: flex;
  flex-direction: column;
  padding: 0 0 24px 0;
  ${media.mobile`
    padding: 0 0 16px 0;
  `}
`

const EnterEmailOrGuid = (props: Props) => {
  const {
    authActions,
    busy,
    exchangeTabClicked,
    formActions,
    formValues,
    invalid,
    isBrowserSupported,
    routerActions,
    submitting,
    walletError
  } = props
  const guidError = walletError && walletError.toLowerCase().includes('unknown wallet id')

  return (
    <LoginWrapper>
      <ProductTabMenu active={ProductAuthOptions.WALLET} onExchangeTabClick={exchangeTabClicked} />
      <WrapperWithPadding>
        <FormGroup>
          <UnsupportedBrowser isSupportedBrowser={isBrowserSupported} />
          <FormItem style={{ marginTop: '40px' }}>
            <LoginFormLabel htmlFor='guid'>
              <FormattedMessage
                id='scenes.login.email_guid'
                defaultMessage='Your Email or Wallet ID'
              />
            </LoginFormLabel>
            <Field
              component={TextBox}
              data-e2e='loginGuidOrEmail'
              disabled={!isBrowserSupported}
              disableSpellcheck
              name='guidOrEmail'
              normalize={removeWhitespace}
              validate={[required, validWalletIdOrEmail]}
              placeholder='Enter email or wallet ID'
              autoFocus
            />
          </FormItem>
          {guidError && (
            <GuidError inline>
              <Text size='12px' color='error' weight={400} data-e2e='walletIdError'>
                <FormattedMessage
                  id='scenes.login.guid_error'
                  defaultMessage='Unknown Wallet ID. Please check that it was entered correctly or try signing in with your email.'
                />
              </Text>
            </GuidError>
          )}
        </FormGroup>
        <LinkRow>
          <ActionButton
            type='submit'
            nature='primary'
            fullwidth
            height='48px'
            disabled={submitting || invalid || busy || !formValues?.guidOrEmail}
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
            authActions={authActions}
            origin='IDENTIFIER'
            product={ProductAuthOptions.WALLET}
          />
        </LinkRow>
      </WrapperWithPadding>
      <SignupLink />
    </LoginWrapper>
  )
}

export default EnterEmailOrGuid
