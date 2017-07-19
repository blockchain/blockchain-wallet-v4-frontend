import React from 'react'

import { SecondaryButton } from 'components/generic/Button'
import { Text, TextGroup } from 'components/generic/Text'
import { SettingComponent, SettingContainer, SettingDescription, SettingHeader, SettingSummary } from 'components/shared/Setting'

const BitcoinLinkHandling = (props) => {
  return (
    <SettingContainer>
      <SettingSummary>
        <SettingHeader>
          <Text id='scenes.preferences.link.title' text='Bitcoin link handling' capitalize />
        </SettingHeader>
        <SettingDescription>
          <Text id='scenes.preferences.link.description' text='Enable this to allow your Blockchain Wallet to handle bitcoin payment links in the web browser.' altFont light />
          <Text id='scenes.preferences.link.description2' text='This will make your experience more convenient when transacting online.' altFont light />
        </SettingDescription>
      </SettingSummary>
      <SettingComponent>
        <SecondaryButton>
          <Text id='scenes.preferences.link.enable' text='Enable' small light white />
        </SecondaryButton>
        <TextGroup>
          <Text id='scenes.preferences.link.unknownstatus' text="We can't detect whether or not handling of bitcoin links has been enabled." altFont light red />
          <Text id='scenes.preferences.link.unknownstatus2' text='If it has already been enabled, nothing will happen.' altFont light red />
        </TextGroup>
      </SettingComponent>
    </SettingContainer>
  )
}

export default BitcoinLinkHandling
