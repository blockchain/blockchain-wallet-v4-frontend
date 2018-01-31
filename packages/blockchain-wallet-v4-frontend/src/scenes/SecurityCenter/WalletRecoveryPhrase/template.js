
import React from 'react'
import { FormattedMessage } from 'react-intl'

import { SecurityComponent, SecurityContainer, SecurityDescription, SecurityHeader, SecurityIcon, SecuritySummary } from 'components/Security'
import Settings from './Settings'

const WalletRecoveryPhrase = (props) => {
  const { isMnemonicVerified } = props

  return (
    <SecurityContainer>
      <SecurityIcon name='pencil' enabled={isMnemonicVerified} />
      <SecuritySummary>
        <SecurityHeader>
          <FormattedMessage id='scenes.securitysettings.basicsecurity.recoveryphrase.title' defaultMessage='Backup Phrase' />
        </SecurityHeader>
        <SecurityDescription>
          <FormattedMessage id='scenes.securitysettings.basicsecurity.recoveryphrase.description' defaultMessage='Your Backup Phrase contains all of the private keys in your wallet, allowing you (or anyone who has it) to restore your wallet and access your funds. Since this is meant for your eyes only, write down your Backup Phrase and keep it somewhere safe offline.' />
          <FormattedMessage id='scenes.securitysettings.basicsecurity.recoveryphrase.description2' defaultMessage='If you ever lose your password or our service is unavailable, your Backup Phrase is how you regain access to your funds.' />
        </SecurityDescription>
      </SecuritySummary>
      <SecurityComponent>
        <Settings />
      </SecurityComponent>
    </SecurityContainer>
  )
}

export default WalletRecoveryPhrase
