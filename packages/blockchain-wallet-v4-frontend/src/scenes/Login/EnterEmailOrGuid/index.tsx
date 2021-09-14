import React from 'react'
import { FormattedMessage } from 'react-intl'
import { Field } from 'redux-form'

import { Banner, HeartbeatLoader, Text } from 'blockchain-info-components'
import { FormGroup, FormItem, TextBox } from 'components/Form'
import { isBrowserSupported } from 'services/browser'
import { required, validWalletIdOrEmail } from 'services/forms'

import { Props } from '..'
import {
  ActionButton,
  BrowserWarning,
  GuidError,
  LinkRow,
  LoginFormLabel,
  NeedHelpLink,
  removeWhitespace
} from '../model'

const isSupportedBrowser = isBrowserSupported()

const EnterEmailOrGuid = (props: Props) => {
  const { authActions, busy, guidOrEmail, invalid, loginError, submitting } = props

  const guidError = loginError && loginError.toLowerCase().includes('unknown wallet id')
  return (
    <>
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
          <LoginFormLabel htmlFor='guid'>
            <FormattedMessage id='scenes.login.email_guid' defaultMessage='Email or Wallet ID' />
          </LoginFormLabel>
          <Field
            component={TextBox}
            data-e2e='loginGuidOrEmail'
            disabled={!isSupportedBrowser}
            disableSpellcheck
            name='guidOrEmail'
            normalize={removeWhitespace}
            validate={[required, validWalletIdOrEmail]}
            placeholder='Enter your email or wallet ID'
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
          disabled={submitting || invalid || busy || !guidOrEmail}
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
        <NeedHelpLink authActions={authActions} origin='IDENTIFIER' />
      </LinkRow>
    </>
  )
}

export default EnterEmailOrGuid
