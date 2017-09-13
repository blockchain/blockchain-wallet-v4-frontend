import React from 'react'
import { FormattedMessage } from 'react-intl'
import { SettingComponent, SettingContainer, SettingDescription, SettingHeader, SettingSummary, SettingStatus } from 'components/Setting'

import Setting from './Setting'

const WalletAccessTor = (props) => {
  const { blockTorIps } = props
  return (
    <SettingContainer>
      <SettingSummary>
        <SettingHeader>
          <FormattedMessage id='scenes.settings.tor.title' defaultMessage='Wallet access via Tor' />
          <SettingStatus active={blockTorIps}>
            {blockTorIps
              ? <FormattedMessage id='scenes.security.tor.blocked' defaultMessage='Blocked' />
              : <FormattedMessage id='scenes.security.tor.allowed' defaultMessage='Allowed' />
            }
          </SettingStatus>
        </SettingHeader>
        <SettingDescription>
          <FormattedMessage id='scenes.settings.tor.description' defaultMessage='Enable the following option to prevent IP addresses that are known to be part of the Tor anonymizing network from accessing your wallet.' />
          <FormattedMessage id='scenes.settings.tor.description2' defaultMessage='The Tor network is frequently used by hackers attempting to access Blockchain users wallets.' />
        </SettingDescription>
      </SettingSummary>
      <SettingComponent>
        <Setting />
      </SettingComponent>
    </SettingContainer>
  )
}

export default WalletAccessTor
