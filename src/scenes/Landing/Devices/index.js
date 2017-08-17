import React from 'react'
import styled from 'styled-components'
import { FormattedMessage } from 'react-intl'

import { Grid } from 'blockchain-info-components'
import { AppleStore, GooglePlay } from 'components/shared/Badges'
import banner from 'img/landing-page-banner-sm-overlay.jpg'

const DevicesContainer = styled.div``
const BannerWrapper = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
  align-items: center;
  height: 300px;
  background: url(${banner});
  background-size: cover;
  background-position: 70% 100%;
`
const BannerContainer = styled(Grid)`
  color: #FFFFFF;
`
const BadgesContainer = styled.div`
  display: block;
  padding: 10px 0;
  & > * { display:inline; margin-right: 5px; }
`

const Devices = (props) => {
  return (
    <DevicesContainer>
      <BannerWrapper>
        <BannerContainer>
          <FormattedMessage id='scenes.landing.devices.bitcoin' defaultMessage='Bitcoin on All Your Devices' />
          <FormattedMessage id='scenes.landing.devices.wallet' defaultMessage='Access your bitcoin wallet securely anywhere you go.' />
          <BadgesContainer>
            <AppleStore />
            <GooglePlay />
          </BadgesContainer>
        </BannerContainer>
      </BannerWrapper>
    </DevicesContainer>
  )
}

export default Devices
