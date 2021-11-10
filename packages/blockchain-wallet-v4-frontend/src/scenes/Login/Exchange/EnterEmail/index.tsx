import React from 'react'
import { FormattedMessage } from 'react-intl'
import { Field } from 'redux-form'

import { HeartbeatLoader, Text } from 'blockchain-info-components'
import { FormGroup, FormItem, TextBox } from 'components/Form'
import { isBrowserSupported } from 'services/browser'
import { required, validEmail } from 'services/forms'

import { Props } from '../..'
import {
  ActionButton,
  LinkRow,
  LoginFormLabel,
  LoginWrapper,
  NeedHelpLink,
  removeWhitespace,
  UnsupportedBrowserWarning
} from '../../model'

const isSupportedBrowser = isBrowserSupported()

const EnterEmail = (props: Props) => {
  const { authActions, busy, formValues, invalid, submitting } = props
  return (
    <LoginWrapper>
      <FormGroup>
        {!isSupportedBrowser && <UnsupportedBrowserWarning />}
        <FormItem>
          <LoginFormLabel htmlFor='guid'>
            <FormattedMessage id='scenes.register.youremail' defaultMessage='Your Email' />
          </LoginFormLabel>

          <Field
            component={TextBox}
            data-e2e='loginGuidOrEmail'
            disabled={!isSupportedBrowser}
            disableSpellcheck
            name='guidOrEmail'
            normalize={removeWhitespace}
            validate={[required, validEmail]}
            placeholder='Enter your email'
            autoFocus
          />
        </FormItem>
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
        <NeedHelpLink authActions={authActions} origin='IDENTIFIER' />
      </LinkRow>
    </LoginWrapper>
  )
}

export default EnterEmail
