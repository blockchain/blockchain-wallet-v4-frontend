import React, { useEffect, useState } from 'react'
import CopyToClipBoard from 'react-copy-to-clipboard'
import { FormattedMessage } from 'react-intl'
import { connect, ConnectedProps } from 'react-redux'
import { IconArrowLeft, IconQuestionCircle } from '@blockchain-com/icons'
import ShowRecoveryWords from 'blockchain-wallet-v4-frontend/src/modals/Settings/RecoveryPhrase/ShowRecoveryWords'
import { path } from 'ramda'
import { bindActionCreators, compose, Dispatch } from 'redux'
import styled from 'styled-components'

import { IconButton, Link, Text, TooltipHost } from 'blockchain-info-components'
import { Flex } from 'components/Flex'
import { duration } from 'components/Flyout'
import { actions, selectors } from 'data'
import { RootState } from 'data/rootReducer'
import { ModalName } from 'data/types'
import modalEnhancer from 'providers/ModalEnhancer'

const PhraseContainer = styled.div`
  width: 100%;
  height: 152px;
  border: 0.3px solid ${(props) => props.theme.grey600};
  border-radius: 6px;
  margin: 76px 0 13px;
`
const BackIconWrapper = styled(IconArrowLeft)`
  cursor: pointer;
  color: ${(props) => props.theme.grey600};
`
const InfoIconWrapper = styled(IconQuestionCircle)`
  cursor: pointer;
  color: ${(props) => props.theme.grey600};
`
const TitleWrapper = styled(Text)`
  margin: 29px auto 12px 0;
`

const ButtonWrapper = styled(Text)`
  color: ${(props) => props.theme['marketing-primary']};
  size: '12px';
  font-weight: 500;
  line-height: '150%';
  font-size: 12px;
`

const BackupSeedPhrase = (props) => {
  const [isShow, setIsShow] = useState<boolean>(false)
  const { active, coin, color, handleClick, modalActions, size, textToCopy } = props

  const handleClickReporting = () => {
    modalActions.showModal(ModalName.TRANSACTION_REPORT_MODAL, {
      coin,
      origin: 'TransactionList'
    })
  }

  const getWords = () => {
    props.settingsActions.showBackupRecovery()
  }

  const handleClose = () => {
    setIsShow(false)
    setTimeout(() => {
      props.close()
    }, duration)
  }

  const handleBackArrow = () => {
    if (props.step === 'FIRST_SET_WORDS') {
      props.recoveryPhraseActions.setStep('RECOVERY_PHRASE_INTRO')
    } else if (props.step === 'SECOND_SET_WORDS') {
      props.recoveryPhraseActions.setStep('FIRST_SET_WORDS')
    } else {
      props.recoveryPhraseActions.setStep('SECOND_SET_WORDS')
    }
  }

  useEffect(() => {
    setIsShow(true)
    getWords()
    props.recoveryPhraseActions.setStep('RECOVERY_PHRASE_INTRO')
  }, [])

  return (
    <div>
      <Flex alignItems='center' justifyContent='space-between'>
        <BackIconWrapper width={24} height={24} onClick={handleBackArrow} />
        <InfoIconWrapper width={20} height={20} />
      </Flex>
      <TitleWrapper color='white' size='20px' weight={600}>
        <FormattedMessage id='plugin.backup-seed-phrase' defaultMessage='Backup Seed Phrase' />
      </TitleWrapper>
      <Text
        color='grey400'
        size='14px'
        weight={500}
        lineHeight='150%'
        style={{ marginBottom: '5px' }}
      >
        <FormattedMessage
          id='plugin.backup-seed-phrase.text.firstsetwords'
          defaultMessage='Your Secret Private Key protects your account.'
        />
        <FormattedMessage
          id='plugin.backup-seed-phrase.text.secondsetwords'
          defaultMessage='You will need it if you lose or reinstall your wallet.'
        />
        <FormattedMessage
          id='plugin.backup-seed-phrase.text.thirdsetwords'
          defaultMessage='Write it down and keep it safe.'
        />
      </Text>
      <Link
        size='14px'
        weight={500}
        target='_blank'
        href='https://support.blockchain.com/hc/en-us/'
      >
        <FormattedMessage id='buttons.learn_more_arrow' defaultMessage='Learn more' />
      </Link>
      <PhraseContainer
        {...props}
        isOpen={isShow}
        onClose={handleClose}
        data-e2e='recoveryPhraseModal'
      >
        {props.step === 'RECOVERY_PHRASE_INTRO' && (
          <div>{/* <RecoveryPhraseIntro {...props} handleClose={handleClose} /> */}</div>
        )}
        {props.step === 'FIRST_SET_WORDS' && (
          <div>{/* <ShowRecoveryWords {...props} handleBackArrow={handleBackArrow} /> */}</div>
        )}
        {props.step === 'SECOND_SET_WORDS' && (
          <div>{/* <ShowRecoveryWords {...props} handleBackArrow={handleBackArrow} /> */}</div>
        )}
        {props.step === 'CONFIRM_WORDS' && (
          <div>{/* <ConfirmWords {...props} handleBackArrow={handleBackArrow} /> */}</div>
        )}
        {props.step === 'CONFIRM_WORDS_SUCCESS' && (
          <div>{/* <ConfirmWordsSuccess {...props} handleClose={handleClose} /> */}</div>
        )}
      </PhraseContainer>
      <Flex alignItems='center' justifyContent='space-between'>
        <CopyToClipBoard text='dcdcdc' onCopy={handleClick}>
          <ButtonWrapper style={{ cursor: 'copy' }}>
            <FormattedMessage defaultMessage='Copy' id='modals.airdropsuccess.copy' />
          </ButtonWrapper>
        </CopyToClipBoard>
        <TooltipHost id='copy.on_chain_txs'>
          <ButtonWrapper
            data-e2e='generateTxReport'
            onClick={handleClickReporting}
            style={{ cursor: 'pointer' }}
          >
            <FormattedMessage id='copy.download' defaultMessage='Download' />
          </ButtonWrapper>
        </TooltipHost>
      </Flex>
    </div>
  )
}

const mapStateToProps = (state: RootState) => ({
  isMnemonicVerified: selectors.core.wallet.isMnemonicVerified(state),
  recoveryPhrase: path(['securityCenter', 'recovery_phrase'], state),
  step: selectors.components.recoveryPhrase.getStep(state)
})

const mapDispatchToProps = (dispatch: Dispatch) => ({
  alertActions: bindActionCreators(actions.alerts, dispatch),
  modalActions: bindActionCreators(actions.modals, dispatch),
  recoveryPhraseActions: bindActionCreators(actions.components.recoveryPhrase, dispatch),
  settingsActions: bindActionCreators(actions.modules.settings, dispatch),
  walletActions: bindActionCreators(actions.core.wallet, dispatch)
})

export default connect(mapStateToProps, mapDispatchToProps)(BackupSeedPhrase)

// const enhance = compose<React.ComponentType>(
//   modalEnhancer(ModalName.RECOVERY_PHRASE_MODAL, { transition: duration }),
//   connector
// )

// export default enhance(BackupSeedPhrase)
