import React, { PureComponent } from 'react'
import { FormattedMessage } from 'react-intl'
import styled from 'styled-components'

import { Button, Text } from 'blockchain-info-components'
import { FlyoutWrapper } from 'components/Flyout'

import { Props } from '../index'

const Wrapper = styled.div`
  display: flex;
  justify-content: space-between;
  flex-direction: column;
  height: 100%;
`
const Header = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 40px;
`
const ButtonWrapper = styled(FlyoutWrapper)`
  padding-top: 0px;
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  justify-content: flex-end;
  margin-top: 5px;
  & > :first-child {
    margin-bottom: 15px;
  }
`
const WarningContent = styled.div`
  display: flex;
  margin-top: 48px;
`
const WarningCircle = styled.div<{ color: string; size: string }>`
  display: flex;
  justify-content: center;
  align-items: center;
  min-width: ${props => props.size};
  height: ${props => props.size};
  border-radius: ${props => props.size};
  background: ${props => props.theme[props.color]};
`

class RecoveryPhraseIntro extends PureComponent<Props> {
  handleBackupNow = () => {
    this.props.recoveryPhraseActions.setStep('FIRST_SET_WORDS')
  }

  render() {
    return (
      <Wrapper>
        <FlyoutWrapper>
          <Header>
            <Text color='grey900' size='24px' weight={600}>
              <FormattedMessage
                id='scenes.securitysettings.basicsecurity.seceretphrase.title'
                defaultMessage='Secret Private Key Recovery Phrase'
              />
            </Text>
          </Header>

          <Text color='grey600' size='14px' weight={500}>
            <FormattedMessage
              id='modals.recoveryphrase.backupyourwallet.content.subheader'
              defaultMessage="In crypto, when you hold the private keys, you're in control of the funds in your Private Key Wallet. The downside is that WHOEVER holds your private keys can control your Private Key Wallet."
            />
          </Text>
          <Text
            color='grey600'
            size='14px'
            weight={500}
            style={{ marginTop: '25px' }}
            lineHeight='1.5'
          >
            <FormattedMessage
              id='modals.recoveryphrase.backupyourwallet.content.youmust'
              defaultMessage='So you must:'
            />
          </Text>
          <Text color='grey600' size='14px' weight={500} lineHeight='1.5'>
            <FormattedMessage
              id='modals.recoveryphrase.backupyourwallet.content.one'
              defaultMessage='1. Write down the 12 word phrase on the next screen in the exact order it appears.'
            />
          </Text>
          <Text color='grey600' size='14px' weight={500} lineHeight='1.5'>
            <FormattedMessage
              id='modals.recoveryphrase.backupyourwallet.content.two'
              defaultMessage='2. Keep it safe, ideally on a securely stored piece of paper (in other words, not a digital copy).'
            />
          </Text>
          <Text color='grey600' size='14px' weight={500} lineHeight='1.5'>
            <FormattedMessage
              id='modals.recoveryphrase.backupyourwallet.content.three_update'
              defaultMessage='3. NEVER share your Secret Private Key Recovery Phrase with anyone.'
            />
          </Text>
          <Text
            color='grey900'
            size='14px'
            weight={600}
            style={{ marginTop: '25px' }}
            lineHeight='1.5'
          >
            <FormattedMessage
              id='modals.recoveryphrase.backupyourwallet.content.warning'
              defaultMessage='Warning: If someone has your Secret Private Key Recovery Phrase they will have access to your Private Key Wallet and can withdraw funds.'
            />
          </Text>
          <WarningContent>
            <WarningCircle color='red100' size='40px'>
              <WarningCircle color='red400' size='20px'>
                <Text color='white' size='14px' weight={600}>
                  !
                </Text>
              </WarningCircle>
            </WarningCircle>
            <Text color='error' weight={600} style={{ marginLeft: '20px' }}>
              <FormattedMessage
                id='modals.recoveryphrase.backupyourwallet.content.warningtwo_new'
                defaultMessage='Blockchain.com will never ask to view or receive your Secret Private Key Recovery Phrase.'
              />
            </Text>
          </WarningContent>
        </FlyoutWrapper>
        <ButtonWrapper>
          <Button
            capitalize
            data-e2e='toBackupFlyout'
            fullwidth
            height='48px'
            nature='primary'
            onClick={this.handleBackupNow}
            size='16px'
          >
            <FormattedMessage
              id='modals.recoveryphrase.backupyourwallet.viewsecretphrase'
              defaultMessage='View Secret Private Key Recovery Phrase'
            />
          </Button>
          <Button
            capitalize
            data-e2e='skipBackup'
            fullwidth
            height='48px'
            nature='light'
            onClick={this.props.handleClose}
            size='16px'
          >
            <FormattedMessage
              id='modals.recoveryphrase.backupyourwallet.later'
              defaultMessage='Do This Later'
            />
          </Button>
        </ButtonWrapper>
      </Wrapper>
    )
  }
}

export default RecoveryPhraseIntro
