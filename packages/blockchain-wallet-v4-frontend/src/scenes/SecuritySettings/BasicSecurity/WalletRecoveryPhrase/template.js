
import React from 'react'
import { FormattedMessage } from 'react-intl'

import { SettingComponent, SettingContainer, SettingDescription, SettingHeader, SettingSummary, SettingStatus } from 'components/Setting'
import Settings from './Settings'

const WalletRecoveryPhrase = (props) => {
  const { isMnemonicVerified } = props

  return (
    <SettingContainer>
      <SettingSummary>
        <SettingHeader>
          <FormattedMessage id='scenes.securitysettings.basicsecurity.recoveryphrase.title' defaultMessage='Wallet Recovery Phrase' />
          <SettingStatus active={isMnemonicVerified}>
            {isMnemonicVerified
              ? <FormattedMessage id='scenes.securitysettings.basicsecurity.recoveryphrase.verified' defaultMessage='Verified' />
              : <FormattedMessage id='scenes.securitysettings.basicsecurity.recoveryphrase.unverified' defaultMessage='Unverified' />
            }
          </SettingStatus>
        </SettingHeader>
        <SettingDescription>
          <FormattedMessage id='scenes.securitysettings.basicsecurity.recoveryphrase.description' defaultMessage='Your recovery phrase can be used to restore all your funds in the case of a lost password or a loss of service at Blockchain.' />
          <FormattedMessage id='scenes.securitysettings.basicsecurity.recoveryphrase.description2' defaultMessage='Note, that the recovery phrase never changes and recovers all of your existing bitcoins as well as newly received funds in this wallet.' />
          <FormattedMessage id='scenes.securitysettings.basicsecurity.recoveryphrase.description3' defaultMessage='Please note that imported addresses are not backed up by the wallet recovery phrase.' />
          <FormattedMessage id='scenes.securitysettings.basicsecurity.recoveryphrase.description4' defaultMessage='We strongly recommend to transfer funds from imported addresses into this wallet.' />
        </SettingDescription>
      </SettingSummary>
      <SettingComponent>
        <Settings />
      </SettingComponent>
    </SettingContainer>
  )
}

export default WalletRecoveryPhrase
