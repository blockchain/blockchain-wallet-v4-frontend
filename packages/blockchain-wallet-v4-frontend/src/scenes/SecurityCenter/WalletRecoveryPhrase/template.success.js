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
  grid-template-columns: 15% 85%;
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
        const againBtn = <Button nature='primary' onClick={props.toggleBackupAgain} >
          <FormattedMessage id='scenes.securitysettings.basicsecurity.twostepverification.settings.enable' defaultMessage='Backup Again' />
        </Button>
        return securityComponent(againBtn)
      } else if (!alone) {
        const backupBtn = <Button nature='primary' onClick={props.toggleNextStep} >
          <FormattedMessage id='scenes.securitysettings.basicsecurity.twostepverification.settings.enable' defaultMessage='Backup Funds' />
        </Button>
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
                    <FormattedMessage id='scenes.securitysettings.basicsecurity.recoveryphrase.description' defaultMessage='Your Backup Phrase contains all of the private keys in your wallet, allowing you (or anyone who has it) to restore your wallet and access your funds. Since this is meant for your eyes only, write down your Backup Phrase and keep it somewhere safe offline.' />
                    <br />
                    <FormattedMessage id='scenes.securitysettings.basicsecurity.recoveryphrase.description2' defaultMessage='If you ever lose your password or our service is unavailable, your Backup Phrase is how you regain access to your funds.' />
                  </span>
                  : <FormattedMessage id='scenes.securitysettings.basicsecurity.recoveryphrase.description2' defaultMessage='Using the 12 words you just wrote down, please enter the following words exactly as you see them to complete the backup process.' />
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
              <FormattedMessage id='scenes.securitysettings.basicsecurity.twostepverification.settings.enable' defaultMessage='Security Tip' />
            </Text>
            <Text weight={200} size='12px'>
              <FormattedMessage id='scenes.securitysettings.basicsecurity.twostepverification.settings.enable' defaultMessage='Do not store your Backup Phrase on your computer or online anywhere. It is very important to keep your Backup Phrase offline in a safe and private place. As a reminder, anyone with access to your Backup Phrase has access to your funds.' />
            </Text>
          </SecurityTip>
          : null
      }
    </React.Fragment>
  )
}

export default WalletRecoveryPhrase
