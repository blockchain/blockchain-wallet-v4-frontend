import React from 'react'
import { FormattedMessage } from 'react-intl'
import { useDispatch } from 'react-redux'
import styled from 'styled-components'

import { Button, Image, Text } from 'blockchain-info-components'
import { Wrapper } from 'components/Public'
import { isBrowserAndroid, isBrowserIOS } from 'services/browser'
import { isMobile } from 'services/styles'

import { Props } from '../..'

const ContentWrapper = styled.div`
  display: flex;
  text-align: center;
  align-items: center;
  flex-direction: column;
`

const SofiSuccess = (props: Props) => {
  // Add check here to make sure that there is wallet data
  // route should navigate to login if there's no wallet data
  const sofiWalletRedirect = () => {}
  const downloadMobileApp = () => {
    if (isBrowserAndroid()) {
      window.open('https://play.google.com/store/apps/details?id=piuk.blockchain.android', '_blank')
    } else if (isBrowserIOS()) {
      window.open('https://itunes.apple.com/us/app/blockchain-bitcoin-wallet/id493253309', '_blank')
    }
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
                defaultMessage='Your account was successfully migrated. Your crypto balances have been imported. Go to the Blockchain.com App to keep enjoying your crypto experience.'
              />
            </Text>
            <Button data-e2e='viewAccount' fullwidth nature='primary' onClick={downloadMobileApp}>
              <Text color='white' size='16px' weight={600}>
                <FormattedMessage
                  id='buttons.download_app'
                  defaultMessage='Download the Blockchain.com App'
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
