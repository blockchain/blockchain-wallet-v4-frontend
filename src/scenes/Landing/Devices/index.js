import React from 'react'
import styled from 'styled-components'

import { Text } from 'components/Shared/Text'
import { Container } from 'components/Shared/Grid'
import banner from 'img/landing-page-banner-sm-overlay.jpg'
import appleStoreBadge from 'img/app-store-badge.svg'
import googlePlayBadge from 'img/google-play-badge.png'

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
const BannerContainer = styled(Container)``
const DownloadContainer = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
  align-items: center;
  padding: 1rem 0;
`
const AppleStoreDownload = styled.img.attrs({
  src: appleStoreBadge
})`
  height: 40px;
  margin-right: 5px;
`
const GooglePlayDownload = styled.img.attrs({
  src: googlePlayBadge
})`
  height: 40px;
`

const Devices = (props) => {
  return (
    <DevicesContainer>
      <BannerWrapper>
        <BannerContainer>
          <Text id='scenes.landing.devices.bitcoin' text='Bitcoin on All Your Devices' giant lighter white />
          <Text id='scenes.landing.devices.wallet' text='Access your bitcoin wallet securely anywhere you go.' light white />
          <DownloadContainer>
            <a href='https://itunes.apple.com/us/app/blockchain-bitcoin-wallet/id493253309' target='_blank'>
              <AppleStoreDownload />
            </a>
            <a href='https://play.google.com/store/apps/details?id=piuk.blockchain.android' target='_blank'>
              <GooglePlayDownload />
            </a>
          </DownloadContainer>
        </BannerContainer>
      </BannerWrapper>
    </DevicesContainer>
  )
}

export default Devices
