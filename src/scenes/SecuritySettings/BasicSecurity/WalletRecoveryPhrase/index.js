import React from 'react'

import { SecondaryButton, Text } from 'blockchain-components'
import { SettingComponent, SettingContainer, SettingDescription, SettingHeader, SettingSummary } from 'components/shared/Setting'

const WalletRecoveryPhrase = (props) => {
  return (
    <SettingContainer>
      <SettingSummary>
        <SettingHeader>
          <Text id='scenes.settings.recoveryphrase.title' text='Wallet password' capitalize />
        </SettingHeader>
        <SettingDescription>
          <Text id='scenes.settings.recoveryphrase.description' text='Your recovery phrase can be used to restore all your funds in the case of a lost password or a loss of service at Blockchain.' altFont light />
          <Text id='scenes.settings.recoveryphrase.description2' text='Note, that the recovery phrase never changes and recovers all of your existing bitcoins as well as newly received funds in this wallet.' altFont light /> 
          <Text id='scenes.settings.recoveryphrase.description3' text='Please note that imported addresses are not backed up by the wallet recovery phrase.' altFont light />
          <Text id='scenes.settings.recoveryphrase.description4' text='We strongly recommend to transfer funds from imported addresses into this wallet.' altFont light />
        </SettingDescription>
      </SettingSummary>
      <SettingComponent>
        <SecondaryButton>
          <Text id='scenes.settings.recoveryphrase.backup' text='Backup phrase' small light white capitalize />
        </SecondaryButton>
      </SettingComponent>
    </SettingContainer>
  )
}

export default WalletRecoveryPhrase
