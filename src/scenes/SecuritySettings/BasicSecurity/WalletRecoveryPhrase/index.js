import React from 'react'
import { FormattedMessage } from 'react-intl'
import { Button } from 'blockchain-info-components'
import { SettingComponent, SettingContainer, SettingDescription, SettingHeader, SettingSummary } from 'components/Setting'

const WalletRecoveryPhrase = (props) => {
  return (
    <SettingContainer>
      <SettingSummary>
        <SettingHeader>
          <FormattedMessage id='scenes.settings.recoveryphrase.title' defaultMessage='Wallet password' />
        </SettingHeader>
        <SettingDescription>
          <FormattedMessage id='scenes.settings.recoveryphrase.description' defaultMessage='Your recovery phrase can be used to restore all your funds in the case of a lost password or a loss of service at Blockchain.' />
          <FormattedMessage id='scenes.settings.recoveryphrase.description2' defaultMessage='Note, that the recovery phrase never changes and recovers all of your existing bitcoins as well as newly received funds in this wallet.' /> 
          <FormattedMessage id='scenes.settings.recoveryphrase.description3' defaultMessage='Please note that imported addresses are not backed up by the wallet recovery phrase.' />
          <FormattedMessage id='scenes.settings.recoveryphrase.description4' defaultMessage='We strongly recommend to transfer funds from imported addresses into this wallet.' />
        </SettingDescription>
      </SettingSummary>
      <SettingComponent>
        <Button type='secondary'>
          <FormattedMessage id='scenes.settings.recoveryphrase.backup' defaultMessage='Backup phrase' />
        </Button>
      </SettingComponent>
    </SettingContainer>
  )
}

export default WalletRecoveryPhrase
