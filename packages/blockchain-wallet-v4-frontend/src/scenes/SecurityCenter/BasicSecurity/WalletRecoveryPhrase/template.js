/* stylelint-disable */
import React from 'react'
import { FormattedMessage } from 'react-intl'
import styled from 'styled-components'

import { Button, Text } from 'blockchain-info-components'

import {
  IconContainer,
  SecurityComponent,
  SecurityContainer,
  SecurityDescription,
  SecurityHeader,
  SecurityIcon,
  SecuritySummary
} from '../../components'

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
const WarningText = styled.div`
  display: flex;
  width: 100%;
  align-items: flex-start;
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
                id='scenes.securitysettings.basicsecurity.seceretphrase.title'
                defaultMessage='Secret Private Key Recovery Phrase'
              />
            </SecurityHeader>
            <SecurityDescription greyOut={isMnemonicVerified}>
              <span>
                <FormattedMessage
                  id='scenes.securitysettings.basicsecurity.recoveryphrase.description'
                  defaultMessage='Your Secret Recovery Phrase is needed to recover your wallet in case the password is lost. Please write these 12 words down, in order, and keep them somewhere safe offline. The secret recovery phrase gives you (or anyone who has it) a way to restore your wallet and access your funds. In the event that you lose your password or our service is unavailable, this will be your safety net.'
                />
              </span>
            </SecurityDescription>
            <WarningText>
              <Text size='14px' weight={500} color='error'>
                <FormattedMessage
                  id='scenes.securitysettings.basicsecurity.recoveryphrase.warning'
                  defaultMessage='Never share your secret phrase with anyone. Blockchain.com will never ask you for this information.'
                />
              </Text>
            </WarningText>
          </SecuritySummary>
        </IconAndHeaderContainer>
        {buttonHelper()}
      </SecurityGridContainer>
    </React.Fragment>
  )
}

export default WalletRecoveryPhrase
