import React from 'react'
import { FormattedMessage } from 'react-intl'
import { Button } from 'blockchain-info-components'
import { SettingComponent, SettingContainer, SettingDescription, SettingHeader, SettingSummary } from 'components/shared/Setting'

const WalletAccessTor = (props) => {
  return (
    <SettingContainer>
      <SettingSummary>
        <SettingHeader>
          <FormattedMessage id='scenes.settings.tor.title' defaultMessage='Wallet access via Tor' />
        </SettingHeader>
        <SettingDescription>
          <FormattedMessage id='scenes.settings.tor.description' defaultMessage='Enable the following option to prevent IP addresses that are known to be part of the Tor anonymizing network from accessing your wallet.' />
          <FormattedMessage id='scenes.settings.tor.description2' defaultMessage='The Tor network is frequently used by hackers attempting to access Blockchain users wallets.' />
        </SettingDescription>
      </SettingSummary>
      <SettingComponent>
        <Button type='secondary'>
          <FormattedMessage id='scenes.settings.tor.block' defaultMessage='Block' />
        </Button>
      </SettingComponent>
    </SettingContainer>
  )
}

export default WalletAccessTor
