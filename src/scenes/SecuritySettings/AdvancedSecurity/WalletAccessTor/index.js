import React from 'react'

import { SecondaryButton, Text } from 'blockchain-info-components'
import { SettingComponent, SettingContainer, SettingDescription, SettingHeader, SettingSummary } from 'components/shared/Setting'

const WalletAccessTor = (props) => {
  return (
    <SettingContainer>
      <SettingSummary>
        <SettingHeader>
          <Text id='scenes.settings.tor.title' text='Wallet access via Tor' capitalize />
        </SettingHeader>
        <SettingDescription>
          <Text id='scenes.settings.tor.description' text='Enable the following option to prevent IP addresses that are known to be part of the Tor anonymizing network from accessing your wallet.' altFont light />
          <Text id='scenes.settings.tor.description2' text='The Tor network is frequently used by hackers attempting to access Blockchain users wallets.' altFont light />
        </SettingDescription>
      </SettingSummary>
      <SettingComponent>
        <SecondaryButton>
          <Text id='scenes.settings.tor.block' text='Block' small light white />
        </SecondaryButton>
      </SettingComponent>
    </SettingContainer>
  )
}

export default WalletAccessTor
