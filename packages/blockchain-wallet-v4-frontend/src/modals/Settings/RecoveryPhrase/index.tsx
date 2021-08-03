import React, { PureComponent } from 'react'
import { connect, ConnectedProps } from 'react-redux'
import { path } from 'ramda'
import { bindActionCreators, compose, Dispatch } from 'redux'

import Flyout, { duration, FlyoutChild } from 'components/Flyout'
import { actions, selectors } from 'data'
import { RootState } from 'data/rootReducer'
import { ModalName } from 'data/types'
import modalEnhancer from 'providers/ModalEnhancer'

import ConfirmWords from './ConfirmWords'
import ConfirmWordsSuccess from './ConfirmWordsSuccess'
import RecoveryPhraseIntro from './RecoveryPhraseIntro'
import ShowRecoveryWords from './ShowRecoveryWords'

export type OwnPropsType = {
  close: () => void
  handleBackArrow: () => void
  handleClose: () => void
  in: boolean
  indexes: Array<number>
  position: number
  recoveryPhrase: Array<any>
  total: number
  userClickedOutside: boolean
}

export type LinkStatePropsType = {
  step:
    | 'RECOVERY_PHRASE_INTRO'
    | 'FIRST_SET_WORDS'
    | 'SECOND_SET_WORDS'
    | 'CONFIRM_WORDS'
    | 'CONFIRM_WORDS_SUCCESS'
}

export type Props = OwnPropsType & ConnectedProps<typeof connector> & LinkStatePropsType

type State = { show: boolean }

class RecoveryPhraseFlyout extends PureComponent<Props, State> {
  constructor(props) {
    super(props)
    this.state = {
      show: false
    }
  }

  componentDidMount() {
    /* eslint-disable */
    this.setState({ show: true })
    /* eslint-enable */
    this.getWords()
  }

  componentWillUnmount() {
    this.props.recoveryPhraseActions.setStep('RECOVERY_PHRASE_INTRO')
  }

  getWords = () => {
    this.props.settingsActions.showBackupRecovery()
  }

  handleClose = () => {
    this.setState({ show: false })
    setTimeout(() => {
      this.props.close()
    }, duration)
  }

  handleBackArrow = () => {
    if (this.props.step === 'FIRST_SET_WORDS') {
      this.props.recoveryPhraseActions.setStep('RECOVERY_PHRASE_INTRO')
    } else if (this.props.step === 'SECOND_SET_WORDS') {
      this.props.recoveryPhraseActions.setStep('FIRST_SET_WORDS')
    } else {
      this.props.recoveryPhraseActions.setStep('SECOND_SET_WORDS')
    }
  }

  render() {
    return (
      <Flyout
        {...this.props}
        isOpen={this.state.show}
        onClose={this.handleClose}
        data-e2e='recoveryPhraseModal'
      >
        {this.props.step === 'RECOVERY_PHRASE_INTRO' && (
          <FlyoutChild>
            <RecoveryPhraseIntro {...this.props} handleClose={this.handleClose} />
          </FlyoutChild>
        )}
        {this.props.step === 'FIRST_SET_WORDS' && (
          <FlyoutChild>
            <ShowRecoveryWords {...this.props} handleBackArrow={this.handleBackArrow} />
          </FlyoutChild>
        )}
        {this.props.step === 'SECOND_SET_WORDS' && (
          <FlyoutChild>
            <ShowRecoveryWords {...this.props} handleBackArrow={this.handleBackArrow} />
          </FlyoutChild>
        )}
        {this.props.step === 'CONFIRM_WORDS' && (
          <FlyoutChild>
            <ConfirmWords {...this.props} handleBackArrow={this.handleBackArrow} />
          </FlyoutChild>
        )}
        {this.props.step === 'CONFIRM_WORDS_SUCCESS' && (
          <FlyoutChild>
            <ConfirmWordsSuccess {...this.props} handleClose={this.handleClose} />
          </FlyoutChild>
        )}
      </Flyout>
    )
  }
}

const mapStateToProps = (state: RootState) => ({
  isMnemonicVerified: selectors.core.wallet.isMnemonicVerified(state),
  recoveryPhrase: path(['securityCenter', 'recovery_phrase'], state),
  step: selectors.components.recoveryPhrase.getStep(state)
})

const mapDispatchToProps = (dispatch: Dispatch) => ({
  recoveryPhraseActions: bindActionCreators(actions.components.recoveryPhrase, dispatch),
  settingsActions: bindActionCreators(actions.modules.settings, dispatch),
  walletActions: bindActionCreators(actions.core.wallet, dispatch)
})

const connector = connect(mapStateToProps, mapDispatchToProps)

const enhance = compose<any>(
  modalEnhancer(ModalName.RECOVERY_PHRASE_MODAL, { transition: duration }),
  connector
)

export default enhance(RecoveryPhraseFlyout)
