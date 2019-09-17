import React from 'react'
import styled from 'styled-components'
import { FormattedMessage } from 'react-intl'
import { Cartridge } from '@blockchain-com/components'
import { Button, Link, Text } from 'blockchain-info-components'

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
      <Copy color='white' size='20px' weight={500}>
        <NewCartridge>
          <FormattedMessage
            id='scenes.home.banners.pitbanner.new'
            defaultMessage='New'
          />
        </NewCartridge>
        <FormattedMessage
          id='scenes.home.banners.pitbanner.trade-1'
          defaultMessage="There's a new way to trade. Link your Wallet for instant access."
        />
      </Copy>
      <Link
        href='https://pit.blockchain.com/'
        target='_blank'
        rel='noopener noreferrer'
      >
        <BannerButton jumbo nature='pitTurquoise'>
          <FormattedMessage
            id='scenes.home.banners.pitbanner.checkitout'
            defaultMessage='Check It Out'
          />
        </BannerButton>
      </Link>
    </Wrapper>
  )
}

export default ThePitBanner
