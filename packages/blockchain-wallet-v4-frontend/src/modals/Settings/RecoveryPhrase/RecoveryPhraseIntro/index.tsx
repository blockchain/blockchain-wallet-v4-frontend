import { Button, Image, Text } from 'blockchain-info-components'
import { FlyoutWrapper } from 'components/Flyout'
import { FormattedMessage } from 'react-intl'
import { Props } from '../index'
import React, { PureComponent } from 'react'
import styled from 'styled-components'

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

const ContentContainer = styled.div`
  margin-bottom: 50px;
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

class RecoveryPhraseIntro extends PureComponent<Props> {
  handleBackupNow = () => {
    this.props.recoveryPhraseActions.setStep('FIRST_SET_WORDS')
  }
  render () {
    return (
      <Wrapper>
        <FlyoutWrapper>
          <Header>
            <Text color='grey600' size='20px' weight={600}>
              <FormattedMessage
                id='modals.recoveryphrase.backupyourwallet.header'
                defaultMessage='Backup Your Wallet'
              />
            </Text>
          </Header>
          <ContentContainer>
            <Text color='grey600' weight={500}>
              <FormattedMessage
                id='modals.recoveryphrase.backupyourwallet.content.one'
                defaultMessage='Your backup phrase will allow you to recover your crypto if you lose access to your wallet.'
              />
            </Text>
            <Text color='grey600' weight={500} style={{ marginTop: '30px' }}>
              <FormattedMessage
                id='modals.recoveryphrase.backupyourwallet.content.two'
                defaultMessage='Please write down these 12 words in order and keep them somwhere safe. Never share it with anyone. Your backup phrase is the key to recovering your crypto if you ever lose your password.'
              />
            </Text>
          </ContentContainer>
          <Image name='recover-padlock' width='375px' />
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
              id='modals.recoveryphrase.backupyourwallet.backupnow'
              defaultMessage='Backup Now'
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
