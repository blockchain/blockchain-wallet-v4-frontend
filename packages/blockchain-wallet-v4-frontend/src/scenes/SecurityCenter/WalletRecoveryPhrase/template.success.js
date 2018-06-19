import React from 'react'
import { FormattedMessage } from 'react-intl'
import { Text, Button } from 'blockchain-info-components'

import { SecurityComponent, SecurityContainer, SecurityDescription, SecurityHeader, SecurityIcon, SecuritySummary, SecurityTip, IconContainer } from 'components/Security'
import RecordBackupPhrase from './RecordBackupPhrase'
import styled from 'styled-components'

const SecurityGridContainer = SecurityContainer.extend`
  border-bottom-left-radius: 0px;
  border-bottom-right-radius: 0px;
  grid-template-columns: 85% 15%;
`
const IconAndHeaderContainer = styled.div`
  display: grid;
  @media(min-width: 480px) {
    grid-template-columns: 15% 85%;
  }
  `
const BackupButton = styled(Button)`
  width: 100px;
  font-size: 12px;
  min-width: 0px;
  @media (min-width: 400px) and (max-width: 991px) {
    font-size: 14px;
    width: 140px;
  }
  @media (min-width: 1224px) {
    width: 140px;
    min-width: 0px;
    font-size: 14px;
  }
`

const WalletRecoveryPhrase = (props) => {
  const { ui, recoveryPhrase, changeDescription, data, alone } = props
  const { isMnemonicVerified } = data

  const buttonHelper = () => {
    const securityComponent = (components) => (
      <SecurityComponent>
        { components }
      </SecurityComponent>
    )
    if (!ui.nextStepToggled) {
      if (!alone && isMnemonicVerified) {
        const againBtn = <BackupButton nature='primary' onClick={props.toggleNextStep} >
          <FormattedMessage id='scenes.securitysettings.basicsecurity.walletrecovery.settings.backupagain' defaultMessage='Backup Again' />
        </BackupButton>
        return securityComponent(againBtn)
      } else if (!alone) {
        const backupBtn = <BackupButton nature='primary' onClick={props.toggleNextStep} >
          <FormattedMessage id='scenes.securitysettings.basicsecurity.walletrecovery.settings.backupfunds' defaultMessage='Backup Funds' />
        </BackupButton>
        return securityComponent(backupBtn)
      }
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
            <SecurityHeader greyOut={isMnemonicVerified && ui.nextStepToggled}>
              <FormattedMessage id='scenes.securitysettings.basicsecurity.recoveryphrase.title' defaultMessage='Backup Phrase' />
            </SecurityHeader>
            <SecurityDescription greyOut={isMnemonicVerified && ui.nextStepToggled}>
              {
                !ui.descriptionToggled
                  ? <span>
                    <FormattedMessage id='scenes.securitysettings.basicsecurity.recoveryphrase.description' defaultMessage='Your backup phrase contains all of the private keys within your wallet. Please write these 12 words down, in order, and keep them somewhere safe offline. This phrase gives you (or anyone who has it) a way to restore your wallet and access your funds. ' />
                    <FormattedMessage id='scenes.securitysettings.basicsecurity.recoveryphrase.description2' defaultMessage='In the event that you lose your password or our service is unavailable, this will be your safety net.' />
                  </span>
                  : <FormattedMessage id='scenes.securitysettings.basicsecurity.recoveryphrase.description.verifyphrase ' defaultMessage='Using the 12 words you just wrote down, please enter the following words exactly as you see them to complete the backup process.' />
              }
            </SecurityDescription>
          </SecuritySummary>
        </IconAndHeaderContainer>

        { buttonHelper() }
        {
          alone || ui.nextStepToggled
            ? <React.Fragment><div /><RecordBackupPhrase handleClose={props.handleClose} phrase={recoveryPhrase} triggerCopyChange={changeDescription} isMnemonicVerified={isMnemonicVerified} goBackOnSuccess={props.goBackOnSuccess} inline={!alone} /></React.Fragment>
            : null
        }
      </SecurityGridContainer>
      {
        alone
          ? <SecurityTip>
            <Text color='brand-primary' size='12px' weight={500}>
              <FormattedMessage id='scenes.securitysettings.basicsecurity.walletrecovery.settings.securitytip' defaultMessage='Security Tip' />
            </Text>
            <Text weight={200} size='12px'>
              <FormattedMessage id='scenes.securitysettings.basicsecurity.walletrecovery.settings.donotstore' defaultMessage='Do not store your backup phrase on your computer or anywhere online. It is very important to keep your backup phrase offline in a private place. As a reminder: anyone with access to your backup phrase can access your funds.' />
            </Text>
          </SecurityTip>
          : null
      }
    </React.Fragment>
  )
}

export default WalletRecoveryPhrase
