import React from 'react'
import { FormattedMessage } from 'react-intl'
import { useDispatch } from 'react-redux'
import styled from 'styled-components'

import { Button, Image, Text } from 'blockchain-info-components'
import { Wrapper } from 'components/Public'
import { actions } from 'data'
import { isMobile } from 'services/styles'

const ContentWrapper = styled.div`
  display: flex;
  text-align: center;
  align-items: center;
  flex-direction: column;
`

const SofiSuccess = () => {
  const dispatch = useDispatch()
  // Add check here to make sure that there is wallet data
  // route should navigate to login if there's no wallet data
  const sofiWalletRedirect = () => {
    dispatch(actions.router.push('/home'))
  }
  const APP_URL = 'https://blockchainwallet.page.link/dashboard'

  const downloadMobileApp = () => {
    window.location.href = APP_URL
  }

  return (
    <Wrapper>
      <ContentWrapper>
        <Image name='checkmark-circle-green' height='40px' />

        <Text size='20px' weight={600} color='black' lineHeight='1.5' style={{ marginTop: '8px' }}>
          <FormattedMessage id='scenes.sofi.signup.success' defaultMessage='You’re all set!' />
        </Text>
        {isMobile() ? (
          <>
            <Text
              color='grey900'
              lineHeight='1.5'
              style={{ marginBottom: '16px', marginTop: '8px' }}
              size='16px'
              weight={500}
            >
              <FormattedMessage
                id='scenes.sofi.login.success.mobile.title'
                defaultMessage='Your account has been successfully migrated. Open the Blockchain.com App now to continue your journey.'
              />
            </Text>
            <Button data-e2e='viewAccount' fullwidth nature='primary' onClick={downloadMobileApp}>
              <Text color='white' size='16px' weight={600}>
                <FormattedMessage
                  id='buttons.open_app'
                  defaultMessage='Open the Blockchain.com App'
                />
              </Text>
            </Button>
          </>
        ) : (
          <>
            <Text
              color='grey900'
              lineHeight='1.5'
              style={{ marginBottom: '16px', marginTop: '8px' }}
              size='16px'
              weight={500}
            >
              <FormattedMessage
                id='scenes.sofi.login.success.title'
                defaultMessage='Your account was successfully migrated. Your crypto balances have been imported.'
              />
            </Text>
            <Button data-e2e='viewAccount' fullwidth nature='primary' onClick={sofiWalletRedirect}>
              <Text color='white' size='16px' weight={600}>
                <FormattedMessage id='buttons.view_my_account' defaultMessage='View my account' />
              </Text>
            </Button>
          </>
        )}
      </ContentWrapper>
    </Wrapper>
  )
}

export default SofiSuccess
