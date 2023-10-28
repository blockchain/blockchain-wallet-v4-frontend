import React, { useEffect } from 'react'
import { FormattedMessage } from 'react-intl'
import { LinkContainer } from 'react-router-bootstrap'
import { Field } from 'redux-form'
import styled from 'styled-components'

import { HeartbeatLoader, Image, Link, Text } from 'blockchain-info-components'
import FormGroup from 'components/Form/FormGroup'
import FormItem from 'components/Form/FormItem'
import TextBox from 'components/Form/TextBox'
import { Wrapper } from 'components/Public'
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
const FormBody = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
`

const SofiVerifyID = (props: Props) => {
  const { busy, formActions, formValues, invalid, magicLinkData, submitting } = props
  const email = 'leora@blockchain.com'

  const validSsn = formValues.sofiLoginSSN?.length === 4

  return (
    <LoginWrapper>
      <SoFiWrapperWithPadding>
        <FormBody>
          <Image name='identification-circle' style={{ marginTop: '24px' }} />
          <Text
            size='20px'
            color='textBlack'
            weight={600}
            lineHeight='1.5'
            style={{ marginTop: '16px', textAlign: 'center' }}
          >
            <FormattedMessage id='scenes.login.sofi.ssn.header' defaultMessage='Verify your ID' />
          </Text>
          <Text
            size='16px'
            color='textBlack'
            weight={500}
            lineHeight='1.5'
            style={{ marginTop: '8px', textAlign: 'center' }}
          >
            <FormattedMessage
              id='scenes.login.sofi.ssn.body'
              defaultMessage='Enter the last 4 of your SSN to verify you’re the owner of this account. We will not store this information.'
            />
          </Text>
          <FormGroup>
            <FormItem style={{ marginTop: '24px' }}>
              <LoginFormLabel htmlFor='sofiLoginEmail'>
                <FormattedMessage id='scenes.login.sofi.ssn' defaultMessage='Last 4 SSN' />
              </LoginFormLabel>
              <Field
                autoFocus
                component={TextBox}
                data-e2e='sofiLoginSSN'
                name='sofiLoginSSN'
                noLastPass
                placeholder='Enter last 4 of your SSN'
              />
            </FormItem>
          </FormGroup>
        </FormBody>
        <LinkRow>
          <ActionButton
            // type='submit'
            onClick={() => formActions.change(LOGIN_FORM, 'step', LoginSteps.SOFI_SUCCESS)}
            nature='primary'
            fullwidth
            height='48px'
            disabled={submitting || invalid || busy || !validSsn}
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

export default SofiVerifyID
