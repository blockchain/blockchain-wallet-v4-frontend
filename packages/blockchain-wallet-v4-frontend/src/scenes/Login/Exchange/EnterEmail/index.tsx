import React from 'react'
import { FormattedMessage } from 'react-intl'
import { Field } from 'redux-form'
import styled from 'styled-components'

import { HeartbeatLoader, Text } from 'blockchain-info-components'
import { FormGroup, FormItem, TextBox } from 'components/Form'
import { Wrapper } from 'components/Public'
import { ProductAuthOptions } from 'data/types'
import { required, validEmail } from 'services/forms'
import { removeWhitespace } from 'services/forms/normalizers'
import { media } from 'services/styles'

import { Props } from '../..'
import NeedHelpLink from '../../components/NeedHelpLink'
import ProductTabMenu from '../../components/ProductTabMenu'
import SignupLink from '../../components/SignupLink'
import UnsupportedBrowser from '../../components/UnsupportedBrowser'
import { ActionButton, LinkRow, LoginFormLabel, WrapperWithPadding } from '../../model'

const LoginWrapper = styled(Wrapper)`
  padding: 0 0 24px 0;
  ${media.mobile`
    padding: 0 0 16px 0;
  `}
`

const EnterEmail = (props: Props) => {
  const {
    authActions,
    busy,
    formValues,
    invalid,
    isBrowserSupported,
    submitting,
    walletTabClicked
  } = props

  return (
    <LoginWrapper>
      <ProductTabMenu active={ProductAuthOptions.EXCHANGE} onWalletTabClick={walletTabClicked} />
      <WrapperWithPadding>
        <FormGroup>
          <UnsupportedBrowser isSupportedBrowser={isBrowserSupported} />
          <FormItem style={{ marginTop: '40px' }}>
            <LoginFormLabel htmlFor='exchangeEmail'>
              <FormattedMessage id='scenes.register.youremail' defaultMessage='Your Email' />
            </LoginFormLabel>

            <Field
              component={TextBox}
              data-e2e='exchangeEmail'
              disabled={!isBrowserSupported}
              disableSpellcheck
              name='exchangeEmail'
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
            disabled={submitting || invalid || busy || !formValues?.exchangeEmail}
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
            product={ProductAuthOptions.EXCHANGE}
          />
        </LinkRow>
      </WrapperWithPadding>
      <SignupLink />
    </LoginWrapper>
  )
}

export default EnterEmail
