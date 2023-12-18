import React, { useEffect } from 'react'
import { FormattedMessage } from 'react-intl'
import { useSelector } from 'react-redux'
import { Field } from 'redux-form'
import styled from 'styled-components'

import { SofiMigrationStatusResponseType } from '@core/network/api/sofi/types'
import { HeartbeatLoader, Icon, Text } from 'blockchain-info-components'
import FormGroup from 'components/Form/FormGroup'
import FormItem from 'components/Form/FormItem'
import TextBox from 'components/Form/TextBox'
import { Wrapper } from 'components/Public'
import { media } from 'services/styles'

import { Props } from '../..'
import { ActionButton, LinkRow, LoginFormLabel, SoFiWrapperWithPadding } from '../../model'

const LoginWrapper = styled(Wrapper)`
  display: flex;
  flex-direction: column;
  padding: 0 0 24px 0;
  ${media.mobile`
    padding: 0 0 16px 0;
  `}
`

const BackArrow = styled.div`
  display: flex;
  align-items: center;
  cursor: pointer;
  margin: 24px 8px 8px 0;
`

const Email = (props: Props) => {
  const { busy, formValues, invalid, routerActions, submitting } = props

  return (
    <LoginWrapper>
      <SoFiWrapperWithPadding>
        <BackArrow onClick={() => routerActions.push('/sofi')}>
          <Icon
            data-e2e='signupBack'
            name='arrow-back'
            size='24px'
            color='blue600'
            style={{ marginRight: '8px' }}
            role='button'
          />

          <Text color='grey900' size='14px' weight={500} lineHeight='1.5'>
            <FormattedMessage id='copy.back' defaultMessage='Back' />
          </Text>
        </BackArrow>
        <Text
          size='20px'
          color='textBlack'
          weight={600}
          lineHeight='1.5'
          style={{ marginTop: '24px', textAlign: 'center' }}
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
              autoCapitalize='none'
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
