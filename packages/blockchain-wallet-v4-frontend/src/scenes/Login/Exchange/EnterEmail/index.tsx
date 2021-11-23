import React from 'react'
import { FormattedMessage } from 'react-intl'
import { Field } from 'redux-form'
import styled from 'styled-components'

import { HeartbeatLoader, Image, Text } from 'blockchain-info-components'
import { FormGroup, FormItem, TextBox } from 'components/Form'
import { Wrapper } from 'components/Public'
import { ProductAuthOptions } from 'data/types'
import { isBrowserSupported } from 'services/browser'
import { required, validEmail } from 'services/forms'

import { Props } from '../..'
import {
  ActionButton,
  LinkRow,
  LoginFormLabel,
  NeedHelpLink,
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
`

const EnterEmail = (props: Props) => {
  const { authActions, busy, formValues, invalid, submitting } = props
  return (
    <LoginWrapper>
      <TabWrapper>
        <ProductTab
          backgroundColor='grey000'
          onClick={() => authActions.setProductAuthMetadata({ product: ProductAuthOptions.WALLET })}
        >
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
        <FormGroup>
          {!isSupportedBrowser && <UnsupportedBrowserWarning />}
          <FormItem style={{ marginTop: '40px' }}>
            <LoginFormLabel htmlFor='email'>
              <FormattedMessage id='scenes.register.youremail' defaultMessage='Your Email' />
            </LoginFormLabel>

            <Field
              component={TextBox}
              data-e2e='exchangeEmail'
              disabled={!isSupportedBrowser}
              disableSpellcheck
              name='email'
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
            disabled={submitting || invalid || busy || !formValues?.email}
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
      </WrapperWithPadding>
      <SignUpLink />
    </LoginWrapper>
  )
}

export default EnterEmail
