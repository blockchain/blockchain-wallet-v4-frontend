import React, { PureComponent } from 'react'
import { connect } from 'react-redux'
import { path } from 'ramda'
import { bindActionCreators, compose, Dispatch } from 'redux'

import Flyout, { duration, FlyoutChild } from 'components/Flyout'
import { actions, selectors } from 'data'
import { RecoveryPhraseStepType } from 'data/components/recoveryPhrase/types'
import { RootState } from 'data/rootReducer'
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

export type LinkDispatchPropsType = {
  recoveryPhraseActions: typeof actions.components.recoveryPhrase
  settingsActions: typeof actions.modules.settings
  walletActions: typeof actions.wallet
}

export type LinkStatePropsType = {
  step:
    | 'RECOVERY_PHRASE_INTRO'
    | 'FIRST_SET_WORDS'
    | 'SECOND_SET_WORDS'
    | 'CONFIRM_WORDS'
    | 'CONFIRM_WORDS_SUCCESS'
}

export type Props = OwnPropsType & LinkDispatchPropsType & LinkStatePropsType
type State = { direction: 'left' | 'right'; show: boolean }

class RecoveryPhraseFlyout extends PureComponent<Props, State> {
  state: State = {
    show: false,
    direction: 'left'
  }

  componentDidMount() {
    /* eslint-disable */
    this.setState({ show: true })
    /* eslint-enable */
    this.getWords()
  }

  componentDidUpdate(prevProps: Props) {
    if (this.props.step === prevProps.step) return
    if (
      RecoveryPhraseStepType[this.props.step] >
      RecoveryPhraseStepType[prevProps.step]
    ) {
      /* eslint-disable */
      this.setState({ direction: 'left' })
    } else {
      this.setState({ direction: 'right' })
      /* eslint-enable */
    }
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
    this.props.step === 'FIRST_SET_WORDS'
      ? this.props.recoveryPhraseActions.setStep('RECOVERY_PHRASE_INTRO')
      : this.props.step === 'SECOND_SET_WORDS'
      ? this.props.recoveryPhraseActions.setStep('FIRST_SET_WORDS')
      : this.props.recoveryPhraseActions.setStep('SECOND_SET_WORDS')
  }

  render() {
    return (
      <Flyout
        {...this.props}
        in={this.state.show}
        onClose={this.handleClose}
        direction={this.state.direction}
        data-e2e='recoveryPhraseModal'
      >
        {this.props.step === 'RECOVERY_PHRASE_INTRO' && (
          <FlyoutChild>
            <RecoveryPhraseIntro
              {...this.props}
              handleClose={this.handleClose}
            />
          </FlyoutChild>
        )}
        {this.props.step === 'FIRST_SET_WORDS' && (
          <FlyoutChild>
            <ShowRecoveryWords
              {...this.props}
              handleBackArrow={this.handleBackArrow}
            />
          </FlyoutChild>
        )}
        {this.props.step === 'SECOND_SET_WORDS' && (
          <FlyoutChild>
            <ShowRecoveryWords
              {...this.props}
              handleBackArrow={this.handleBackArrow}
            />
          </FlyoutChild>
        )}
        {this.props.step === 'CONFIRM_WORDS' && (
          <FlyoutChild>
            <ConfirmWords
              {...this.props}
              handleBackArrow={this.handleBackArrow}
            />
          </FlyoutChild>
        )}
        {this.props.step === 'CONFIRM_WORDS_SUCCESS' && (
          <FlyoutChild>
            <ConfirmWordsSuccess
              {...this.props}
              handleClose={this.handleClose}
            />
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

const mapDispatchToProps = (dispatch: Dispatch): LinkDispatchPropsType => ({
  settingsActions: bindActionCreators(actions.modules.settings, dispatch),
  recoveryPhraseActions: bindActionCreators(
    actions.components.recoveryPhrase,
    dispatch
  ),
  walletActions: bindActionCreators(actions.wallet, dispatch)
})

const enhance = compose<any>(
  modalEnhancer('RECOVERY_PHRASE_MODAL', { transition: duration }),
  connect(mapStateToProps, mapDispatchToProps)
)

export default enhance(RecoveryPhraseFlyout)
