import React from 'react'
import { FormattedMessage } from 'react-intl'
import { LinkContainer } from 'react-router-bootstrap'
import { Field } from 'redux-form'
import styled from 'styled-components'

import { HeartbeatLoader, Link, Text } from 'blockchain-info-components'
import FormGroup from 'components/Form/FormGroup'
import FormItem from 'components/Form/FormItem'
import TextBox from 'components/Form/TextBox'
import { Wrapper } from 'components/Public'
import { ProductAuthOptions } from 'data/types'
import { required, validWalletIdOrEmail } from 'services/forms'
import { removeWhitespace } from 'services/forms/normalizers'
import { media } from 'services/styles'

import { Props } from '../..'
import ProductTabMenu from '../../components/ProductTabMenu'
import SignupLink from '../../components/SignupLink'
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
  const { busy, exchangeTabClicked, formValues, invalid, magicLinkData, submitting, walletError } =
    props
  const guidError = walletError && walletError.toLowerCase().includes('unknown wallet id')

  return (
    <LoginWrapper>
      <ProductTabMenu active={ProductAuthOptions.WALLET} onExchangeTabClick={exchangeTabClicked} />
      <WrapperWithPadding>
        <FormGroup>
          <FormItem style={{ marginTop: '40px' }}>
            <LoginFormLabel htmlFor='guid'>
              <FormattedMessage id='scenes.login.email_guid' defaultMessage='Email or Wallet ID' />
            </LoginFormLabel>
            <Field
              autoFocus
              component={TextBox}
              data-e2e='loginGuidOrEmail'
              disableSpellcheck
              errorTop
              errorRight
              name='guidOrEmail'
              normalize={removeWhitespace}
              validate={[required, validWalletIdOrEmail]}
              placeholder='Enter Email or Wallet ID'
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
          <LinkContainer to={{ pathname: '/recover', state: { showPhraseStep: true } }}>
            <Link size='13px' weight={600} data-e2e='loginImportAccount'>
              <FormattedMessage
                id='scenes.login.import_your_account'
                defaultMessage='Import Your Account'
              />
            </Link>
          </LinkContainer>
        </LinkRow>
      </WrapperWithPadding>
      <SignupLink platform={magicLinkData?.platform_type} />
    </LoginWrapper>
  )
}

export default EnterEmailOrGuid
