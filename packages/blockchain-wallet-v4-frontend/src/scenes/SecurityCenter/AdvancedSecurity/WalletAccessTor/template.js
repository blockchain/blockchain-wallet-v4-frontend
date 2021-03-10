import React from 'react'
import { FormattedMessage } from 'react-intl'

import { Button } from 'blockchain-info-components'
import {
  SettingComponent,
  SettingContainer,
  SettingDescription,
  SettingHeader,
  SettingStatus,
  SettingSummary,
  SettingWrapper
} from 'components/Setting'

const WalletAccessTor = props => {
  const { blockingTor, handleClick } = props
  return (
    <SettingContainer>
      <SettingSummary>
        <SettingHeader>
          <FormattedMessage
            id='scenes.settings.tor.title'
            defaultMessage='Wallet Access via Tor'
          />
          <SettingStatus active={blockingTor}>
            {blockingTor ? (
              <FormattedMessage
                id='scenes.security.tor.blocked'
                defaultMessage='Blocked'
              />
            ) : (
              <FormattedMessage
                id='scenes.security.tor.allowed'
                defaultMessage='Allowed'
              />
            )}
          </SettingStatus>
        </SettingHeader>
        <SettingDescription>
          <FormattedMessage
            id='scenes.settings.tor.description'
            defaultMessage='Enable the following option to prevent IP addresses that are known to be part of the Tor anonymizing network from accessing your wallet.'
          />
          <FormattedMessage
            id='scenes.settings.tor.description2'
            defaultMessage='The Tor network is frequently used by hackers attempting to access Blockchain users wallets.'
          />
        </SettingDescription>
      </SettingSummary>
      <SettingComponent>
        <SettingWrapper>
          <Button nature='primary' onClick={handleClick}>
            {blockingTor ? (
              <FormattedMessage
                id='scenes.securitysettings.advancedsettings.walletaccesstor.settings.allow'
                defaultMessage='Allow'
              />
            ) : (
              <FormattedMessage
                id='scenes.securitysettings.advancedsettings.walletaccesstor.settings.block'
                defaultMessage='Block'
              />
            )}
          </Button>
        </SettingWrapper>
      </SettingComponent>
    </SettingContainer>
  )
}

export default WalletAccessTor
