import React from 'react'
import { FormattedMessage } from 'react-intl'
import { SettingComponent, SettingContainer, SettingDescription, SettingHeader, SettingSummary } from 'components/Setting'
import Settings from './Settings'

const WalletPassword = (props) => {
  return (
    <SettingContainer>
      <SettingSummary>
        <SettingHeader>
          <FormattedMessage id='scenes.securitysettings.basicsecurity.walletpassword.title' defaultMessage='Wallet Password' />
        </SettingHeader>
        <SettingDescription>
          <FormattedMessage id='scenes.securitysettings.basicsecurity.walletpassword.description' defaultMessage='Your password is never shared with Blockchain or stored on our servers. This means we cannot access or reset your password if you forget it.' />
          <FormattedMessage id='scenes.securitysettings.basicsecurity.walletpassword.description2' defaultMessage='Make sure you write down your backup phrase which is the only way to restore access to your wallet in the event of a lost password.' />
        </SettingDescription>
      </SettingSummary>
      <SettingComponent>
        <Settings />
      </SettingComponent>
    </SettingContainer>
  )
}

export default WalletPassword
