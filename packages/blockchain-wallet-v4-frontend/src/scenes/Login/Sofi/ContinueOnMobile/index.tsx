import React from 'react'
import { FormattedMessage } from 'react-intl'
import { useDispatch } from 'react-redux'
import styled from 'styled-components'

import { Badge, Button, Image, Text } from 'blockchain-info-components'
import { Wrapper } from 'components/Public'
import { actions } from 'data'
import { isBrowserAndroid, isBrowserIOS } from 'services/browser'
import { isMobile, media } from 'services/styles'

import { Props } from '../..'
import { CircleBackground } from '../../model'

const ContentWrapper = styled.div`
  display: flex;
  text-align: center;
  align-items: center;
  flex-direction: column;
`

const AppButtons = styled.footer`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 16px;
  text-align: center;
  width: 100%;
  max-height: 5.25rem;
  transition: all 0.5s ease;
  ${media.mobile`
  flex-direction: column;
    img {
      height: auto;
      width: 40%;
    }
  `};
`

const ContinueOnMobile = (props: Props) => {
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
        <CircleBackground color='blue600'>
          <Image name='mobile' height='30px' color='white' />
        </CircleBackground>

        <Text size='20px' weight={600} color='black' lineHeight='1.5' style={{ marginTop: '8px' }}>
          <FormattedMessage
            id='scenes.sofi.signup.continueonphone'
            defaultMessage='Continue on your phone'
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
            id='scenes.sofi.continueonmobile.description1'
            defaultMessage='At this moment, the Blockchain.com Wallet is only available on mobile for your region.'
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
            id='scenes.sofi.continueonmobile.description2'
            defaultMessage='To keep enjoying your Blockchain.com experience, please use the mobile app.'
          />
        </Text>
        {isMobile() ? (
          <Button data-e2e='viewAccount' fullwidth nature='primary' onClick={downloadMobileApp}>
            <Text color='white' size='16px' weight={600}>
              <FormattedMessage
                id='buttons.download_app'
                defaultMessage='Download the Blockchain.com App'
              />
            </Text>
          </Button>
        ) : (
          <AppButtons>
            <Badge type='applestore' />
            <Badge type='googleplay' />
          </AppButtons>
        )}
      </ContentWrapper>
    </Wrapper>
  )
}

export default ContinueOnMobile
