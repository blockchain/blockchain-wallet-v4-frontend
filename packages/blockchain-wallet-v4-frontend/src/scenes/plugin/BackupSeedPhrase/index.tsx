import React, { useEffect, useState } from 'react'
import { connect } from 'react-redux'
import { path } from 'ramda'
import { bindActionCreators, Dispatch } from 'redux'
import styled from 'styled-components'

import { Flex } from 'components/Flex'
import { duration } from 'components/Flyout'
import { actions, selectors } from 'data'
import { RootState } from 'data/rootReducer'

import ConfirmWords from './ConfirmWords'
import ConfirmWordsSuccess from './ConfirmWordsSuccess'
import PinPluginInfo from './PinPluginInfo'
import RecoveryWords from './RecoveryWords'
import ShortcutInfo from './ShortcutInfo'

const Wrapper = styled(Flex)`
  height: 100%;
  > div {
    height: 100%;
  }
  form {
    height: 100%;
  }
`
const BackupSeedPhrase = (props) => {
  const [isShow, setIsShow] = useState<boolean>(false)

  const handleBackupNow = () => {
    props.walletActions.triggerMnemonicViewedAlert()
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

  useEffect(() => {
    if (props.isMnemonicVerified) {
      props.recoveryPhraseActions.setStep('CONFIRM_WORDS_SHORTCUT')
    } else {
      props.recoveryPhraseActions.setStep('FIRST_SET_WORDS')
    }
  }, [])

  useEffect(() => {
    handleBackupNow()
    setIsShow(true)
    getWords()
  }, [isShow])

  const handleBackArrow = () => {
    switch (props.step) {
      case 'FIRST_SET_WORDS':
        props.recoveryPhraseActions.setStep('RECOVERY_PHRASE_INTRO')
        break
      case 'CONFIRM_WORDS':
        props.recoveryPhraseActions.setStep('FIRST_SET_WORDS')
        break
      case 'CONFIRM_WORDS_SUCCESS':
        props.recoveryPhraseActions.setStep('CONFIRM_WORDS')
        break
      case 'CONFIRM_WORDS_SHORTCUT':
        props.recoveryPhraseActions.setStep('CONFIRM_WORDS_SUCCESS')
        break
      default:
        props.recoveryPhraseActions.setStep('CONFIRM_WORDS_SHORTCUT')
        break
    }
  }

  return (
    <Wrapper
      {...props}
      isOpen={isShow}
      onClose={handleClose}
      data-e2e='recoveryPhraseModal'
      flexDirection='column'
    >
      {props.step === 'FIRST_SET_WORDS' && <RecoveryWords {...props} />}
      {props.step === 'CONFIRM_WORDS' && (
        <ConfirmWords {...props} handleBackArrow={handleBackArrow} />
      )}
      {props.step === 'CONFIRM_WORDS_SUCCESS' && (
        <ConfirmWordsSuccess {...props} handleClose={handleClose} />
      )}
      {props.step === 'CONFIRM_WORDS_SHORTCUT' && (
        <ShortcutInfo {...props} handleClose={handleClose} />
      )}
      {props.step === 'CONFIRM_WORDS_PIN' && <PinPluginInfo {...props} handleClose={handleClose} />}
    </Wrapper>
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
