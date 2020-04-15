import { Button } from 'blockchain-info-components'
import { FormattedMessage } from 'react-intl'
import {
  IconContainer,
  SecurityComponent,
  SecurityContainer,
  SecurityDescription,
  SecurityHeader,
  SecurityIcon,
  SecuritySummary
} from 'components/Security'
import React from 'react'
import styled from 'styled-components'

const SecurityGridContainer = styled(SecurityContainer)`
  border-bottom-left-radius: 0;
  border-bottom-right-radius: 0;
  grid-template-columns: 85% 15%;
`

const IconAndHeaderContainer = styled.div`
  display: grid;
  @media (min-width: 480px) {
    grid-template-columns: 15% 85%;
  }
`
const BackupButton = styled(Button)`
  width: 100px;
  font-size: 12px;
  min-width: 0;
  height: auto;
  span {
    white-space: initial;
  }
  @media (min-width: 400px) and (max-width: 991px) {
    font-size: 14px;
    width: 140px;
  }
  @media (min-width: 1224px) {
    width: 140px;
    min-width: 0;
    font-size: 14px;
  }
`

const WalletRecoveryPhrase = props => {
  const { handleBackupNow, isMnemonicVerified } = props

  const buttonHelper = () => {
    const securityComponent = components => (
      <SecurityComponent>{components}</SecurityComponent>
    )
    if (isMnemonicVerified) {
      const againBtn = (
        <BackupButton
          nature='primary'
          onClick={handleBackupNow}
          data-e2e='backupFundsButton'
        >
          <FormattedMessage
            id='scenes.securitysettings.basicsecurity.walletrecovery.settings.backupagain'
            defaultMessage='Backup Again'
          />
        </BackupButton>
      )
      return securityComponent(againBtn)
    } else {
      const backupBtn = (
        <BackupButton
          nature='primary'
          onClick={handleBackupNow}
          data-e2e='backupFundsButton'
        >
          <FormattedMessage
            id='scenes.securitysettings.basicsecurity.walletrecovery.settings.backupfunds'
            defaultMessage='Backup Funds'
          />
        </BackupButton>
      )
      return securityComponent(backupBtn)
    }
  }

  return (
    <React.Fragment>
      <SecurityGridContainer>
        <IconAndHeaderContainer>
          <IconContainer>
            <SecurityIcon name='pencil' enabled={isMnemonicVerified} />
          </IconContainer>
          <SecuritySummary>
            <SecurityHeader greyOut={isMnemonicVerified}>
              <FormattedMessage
                id='scenes.securitysettings.basicsecurity.recoveryphrase.title'
                defaultMessage='Backup Phrase'
              />
            </SecurityHeader>
            <SecurityDescription greyOut={isMnemonicVerified}>
              <span>
                <FormattedMessage
                  id='scenes.securitysettings.basicsecurity.recoveryphrase.description'
                  defaultMessage='Your backup phrase contains all of the private keys within your wallet. Please write these 12 words down, in order, and keep them somewhere safe offline. This phrase gives you (or anyone who has it) a way to restore your wallet and access your funds.'
                />
                <span>&nbsp;</span>
                <FormattedMessage
                  id='scenes.securitysettings.basicsecurity.recoveryphrase.description2'
                  defaultMessage='In the event that you lose your password or our service is unavailable, this will be your safety net.'
                />
              </span>
            </SecurityDescription>
          </SecuritySummary>
        </IconAndHeaderContainer>
        {buttonHelper()}
      </SecurityGridContainer>
    </React.Fragment>
  )
}

export default WalletRecoveryPhrase
