import React from 'react'
import { FormattedMessage } from 'react-intl'

import {
  SettingComponent,
  SettingContainer,
  SettingDescription,
  SettingHeader,
  SettingSummary
} from 'components/Setting'

import Settings from './Settings'

const WalletPassword = props => {
  return (
    <SettingContainer>
      <SettingSummary>
        <SettingHeader>
          <FormattedMessage
            id='scenes.securitysettings.advanced.walletpassword.title'
            defaultMessage='Password'
          />
        </SettingHeader>
        <SettingDescription>
          <FormattedMessage
            id='scenes.securitysettings.advanced.walletpassword.description_one'
            defaultMessage='Your password is never shared with Blockchain or stored on our servers. We cannot access or reset your password. The only way to restore your wallet is through your Secret Private Key Recovery Phrase .'
          />
          <FormattedMessage
            id='scenes.securitysettings.advanced.walletpassword.description_two'
            defaultMessage='Make sure you write down your Secret Private Key Recovery Phrasewhich is the only way to restore access to your wallet in the event of a lost password.'
          />
        </SettingDescription>
      </SettingSummary>
      <SettingComponent>
        <Settings />
      </SettingComponent>
    </SettingContainer>
  )
}

export default WalletPassword
