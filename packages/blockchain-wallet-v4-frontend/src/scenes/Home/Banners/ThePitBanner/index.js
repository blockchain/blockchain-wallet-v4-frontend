import React from 'react'
import styled from 'styled-components'
import { FormattedMessage } from 'react-intl'
import { LinkContainer } from 'react-router-bootstrap'

import { Cartridge } from '@blockchain-com/components'
import { Button, Text } from 'blockchain-info-components'

import media from 'services/ResponsiveService'

const Wrapper = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  background-image: url('/img/starfield-banner-bg.png');
  background-size: cover;
  border-radius: 8px;
  overflow: hidden;
  padding: 20px;

  @media (min-width: 1200px) {
    height: 80px;
    padding: 0 20px;
  }
  ${media.mobile`
    flex-direction: column;
  `}
`

const Row = styled.div`
  display: flex;
  align-items: center;
  margin-right: 12px;
`

const Column = styled.div`
  display: flex;
  flex-direction: column;

  & > div:first-child {
    margin-bottom: 4px;
  }
`
const NewCartridge = styled(Cartridge)`
  border: 1px solid ${props => props.theme['pitTurquoise']};
  background: ${props => props.theme['green900']};
  color: ${props => props.theme['pitTurquoise']};
  margin-left: 0px;
  margin-right: 20px;
  border-radius: 4px;
  width: 56px;
  height: 14px;
`
const Copy = styled(Text)`
  display: flex;
  align-items: center;
  ${media.mobile`
    font-size: 12px;
  `}
  ${media.tablet`
    font-size: 14px;
  `}
`
const BannerButton = styled(Button)`
  height: 48px;
  ${media.mobile`
    font-size: 14px;
    margin-top: 8px;
    padding: 10px;
  `}
`

const ThePitBanner = () => {
  return (
    <Wrapper>
      <Row>
        <NewCartridge>
          <FormattedMessage
            id='scenes.home.banners.pitbanner.new'
            defaultMessage='New'
          />
        </NewCartridge>
        <Column>
          <Copy color='white' size='20px' weight={500}>
            <FormattedMessage
              id='scenes.home.banners.pitbanner.content1'
              defaultMessage='We built our own exchange that links to your Wallet.'
            />
          </Copy>
          <Copy color='white' size='20px' weight={500}>
            <FormattedMessage
              id='scenes.home.banners.pitbanner.content3'
              defaultMessage='Instantly access more cryptos and deposit/withdraw cash.'
            />
          </Copy>
        </Column>
      </Row>
      <LinkContainer to='/thepit' rel='noopener noreferrer'>
        <BannerButton jumbo nature='pitTurquoise'>
          <FormattedMessage
            id='scenes.home.banners.pitbanner.getstarted'
            defaultMessage='Get Started'
          />
        </BannerButton>
      </LinkContainer>
    </Wrapper>
  )
}

export default ThePitBanner
