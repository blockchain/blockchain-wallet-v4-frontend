import React, { useEffect } from 'react'
import { FormattedMessage } from 'react-intl'
import { useSelector } from 'react-redux'
import { LinkContainer } from 'react-router-bootstrap'
import { Field } from 'redux-form'
import styled from 'styled-components'

import { SofiMigrationStatusResponseType } from '@core/network/api/sofi/types'
import { HeartbeatLoader, Link, Text } from 'blockchain-info-components'
import FormGroup from 'components/Form/FormGroup'
import FormItem from 'components/Form/FormItem'
import TextBox from 'components/Form/TextBox'
import { Wrapper } from 'components/Public'
import { selectors } from 'data'
import { LOGIN_FORM } from 'data/auth/model'
import { LoginSteps, ProductAuthOptions } from 'data/types'
import { required, validWalletIdOrEmail } from 'services/forms'
import { removeWhitespace } from 'services/forms/normalizers'
import { media } from 'services/styles'

import { Props } from '../..'
import {
  ActionButton,
  GuidError,
  LinkRow,
  LoginFormLabel,
  SoFiWrapperWithPadding
} from '../../model'

const LoginWrapper = styled(Wrapper)`
  display: flex;
  flex-direction: column;
  padding: 0 0 24px 0;
  ${media.mobile`
    padding: 0 0 16px 0;
  `}
`

const Email = (props: Props) => {
  const { busy, formActions, formValues, invalid, magicLinkData, submitting } = props
  const { sofiJwtPayload } = useSelector(selectors.modules.profile.getSofiUserData).getOrElse(
    {}
  ) as SofiMigrationStatusResponseType
  const { email } = sofiJwtPayload
  useEffect(() => {
    if (email) {
      formActions.change(LOGIN_FORM, 'sofiLoginEmail', email)
    }
  }, [formActions, email])

  return (
    <LoginWrapper>
      <SoFiWrapperWithPadding>
        <Text
          size='20px'
          color='textBlack'
          weight={600}
          lineHeight='1.5'
          style={{ marginTop: '40px', textAlign: 'center' }}
        >
          <FormattedMessage
            id='scenes.login.sofi.header'
            defaultMessage='Let’s migrate your account.'
          />
        </Text>
        <Text
          size='16px'
          color='textBlack'
          weight={500}
          lineHeight='1.5'
          style={{ marginTop: '8px', textAlign: 'center' }}
        >
          <FormattedMessage
            id='scenes.login.sofi.body'
            defaultMessage='Sign into your Blockchain.com account. Next, we’ll migrate your crypto from SoFi.'
          />
        </Text>
        <FormGroup>
          <FormItem style={{ marginTop: '24px' }}>
            <LoginFormLabel htmlFor='sofiLoginEmail'>
              <FormattedMessage id='scenes.login.email_guid' defaultMessage='Email or Wallet ID' />
            </LoginFormLabel>
            <Field
              autoFocus
              component={TextBox}
              data-e2e='sofiLoginEmail'
              name='sofiLoginEmail'
              noLastPass
            />
          </FormItem>
        </FormGroup>
        <LinkRow>
          <ActionButton
            type='submit'
            nature='primary'
            fullwidth
            height='48px'
            disabled={submitting || invalid || busy || !formValues?.sofiLoginEmail}
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
        </LinkRow>
      </SoFiWrapperWithPadding>
    </LoginWrapper>
  )
}

export default Email
