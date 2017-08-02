import React from 'react'
import styled from 'styled-components'

import { Text } from 'components/generic/Text'
import { AppleStore, GooglePlay } from 'components/shared/Badges'
import { SettingComponent, SettingContainer, SettingDescription, SettingHeader, SettingSummary } from 'components/shared/Setting'
import Settings from './Settings'

const BadgesContainer = styled.div`
  display: block;
  padding: 10px 0;
  & > * { display:inline; margin-right: 5px; }
`

const PairingCode = (props) => {
  return (
    <SettingContainer>
      <SettingSummary>
        <SettingHeader>
          <Text id='scenes.info.pairingcode.title' text='Mobile app pairing code' capitalize />
        </SettingHeader>
        <SettingDescription>
          <Text id='scenes.info.pairingcode.description' text="Scan the code (click on 'Show Pairing Code') with your Blockchain Wallet (iOS or Android) for a seamless connection to your wallet." altFont light />
          <Text id='scenes.info.pairingcode.description2' text='Download our mobiles applications below' altFont light />
          <Text id='scenes.info.pairingcode.warning' text='Do not share your Pairing Code with others.' altFont light red />
          <BadgesContainer>
            <AppleStore />
            <GooglePlay />
          </BadgesContainer>
        </SettingDescription>
      </SettingSummary>
      <SettingComponent>
        <Settings />
      </SettingComponent>
    </SettingContainer>
  )
}

export default PairingCode
