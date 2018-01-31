
import React from 'react'
import { FormattedMessage } from 'react-intl'

import { SecurityComponent, SecurityContainer, SecurityDescription, SecurityHeader, SecurityIcon, SecuritySummary } from 'components/Security'
import Settings from './Settings'

const WalletRecoveryPhrase = (props) => {
  const { isMnemonicVerified } = props

  return (
    <SecurityContainer>
      <SecurityIcon name='pencil' />
      <SecuritySummary>
        <SecurityHeader>
          <FormattedMessage id='scenes.securitysettings.basicsecurity.recoveryphrase.title' defaultMessage='Wallet Recovery Phrase' />
        </SecurityHeader>
        <SecurityDescription>
          <FormattedMessage id='scenes.securitysettings.basicsecurity.recoveryphrase.description' defaultMessage='Your recovery phrase can be used to restore all your funds in the case of a lost password or a loss of service at Blockchain.' />
          <FormattedMessage id='scenes.securitysettings.basicsecurity.recoveryphrase.description2' defaultMessage='Note, that the recovery phrase never changes and recovers all of your existing bitcoins as well as newly received funds in this wallet.' />
          <FormattedMessage id='scenes.securitysettings.basicsecurity.recoveryphrase.description3' defaultMessage='Please note that imported addresses are not backed up by the wallet recovery phrase.' />
          <FormattedMessage id='scenes.securitysettings.basicsecurity.recoveryphrase.description4' defaultMessage='We strongly recommend to transfer funds from imported addresses into this wallet.' />
        </SecurityDescription>
      </SecuritySummary>
      <SecurityComponent>
        <Settings />
      </SecurityComponent>
    </SecurityContainer>
  )
}

export default WalletRecoveryPhrase
