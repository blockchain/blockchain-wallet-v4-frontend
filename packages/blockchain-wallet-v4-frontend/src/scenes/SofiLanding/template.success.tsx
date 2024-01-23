import React, { useEffect } from 'react'
import { FormattedMessage } from 'react-intl'
import { useDispatch } from 'react-redux'
import styled from 'styled-components'

import { Button, Text } from 'blockchain-info-components'
import { Wrapper } from 'components/Public'
import { actions } from 'data'
import { Analytics, LoginSteps } from 'data/types'

const ContentWrapper = styled.div`
  display: flex;
  text-align: center;
  align-items: center;
  flex-direction: column;
`

const SofiSuccessLanding = () => {
  const dispatch = useDispatch()

  useEffect(() => {
    dispatch(
      actions.analytics.trackEvent({
        key: Analytics.SOFI_MIGRATION_DASHBOARD_SHOWED,
        properties: {}
      })
    )
  }, [])

  const loginButtonClick = () => {
    dispatch(actions.router.push('/login/sofi'))
    dispatch(actions.form.change('login', 'step', LoginSteps.SOFI_EMAIL))
  }
  return (
    <Wrapper>
      <ContentWrapper>
        <Text size='20px' weight={600} color='black' lineHeight='1.5' style={{ marginTop: '8px' }}>
          <FormattedMessage
            id='scenes.sofi.welcome.header'
            defaultMessage='Welcome to Blockchain.com!'
          />
        </Text>
        <Text
          color='grey600'
          lineHeight='1.5'
          style={{ marginBottom: '16px', marginTop: '8px' }}
          size='16px'
          weight={500}
        >
          <FormattedMessage
            id='scenes.sofi.signup.welcome.body'
            defaultMessage='Migrating your crypto from SoFi is super quick. Choose how you’d like to continue. We’ll take care of migrating your crypto.'
          />
        </Text>
        <Text
          color='grey900'
          lineHeight='1.5'
          style={{ marginBottom: '16px', marginTop: '8px' }}
          size='16px'
          weight={500}
        >
          <FormattedMessage
            id='scenes.sofi.signup.welcome.new'
            defaultMessage='New to Blockchain.com?'
          />
        </Text>
        <Button
          data-e2e='newSofi'
          fullwidth
          nature='primary'
          onClick={() => dispatch(actions.router.push('/signup/sofi'))}
          style={{ marginBottom: '16px' }}
        >
          <Text color='white' size='16px' weight={600}>
            <FormattedMessage id='buttons.signup' defaultMessage='Sign Up' />
          </Text>
        </Button>
        <Text
          color='grey900'
          lineHeight='1.5'
          style={{ marginBottom: '16px', marginTop: '8px' }}
          size='16px'
          weight={500}
        >
          <FormattedMessage
            id='scenes.sofi.signup.welcome.existing'
            defaultMessage='Already have a Blockchain account?'
          />
        </Text>
        <Button data-e2e='existingSofi' fullwidth nature='dark' onClick={loginButtonClick}>
          <Text color='white' size='16px' weight={600}>
            <FormattedMessage id='scenes.login.login' defaultMessage='Log In' />
          </Text>
        </Button>
      </ContentWrapper>
    </Wrapper>
  )
}

export default SofiSuccessLanding
